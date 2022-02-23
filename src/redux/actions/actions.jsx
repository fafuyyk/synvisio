import * as types from './actionTypes';
import sampleSourceMapper from '../../utils/sampleSourceMapper';
import processAlignment from '../../utils/filterAlignment';
import processLinkage from '../../utils/filterLinkageList';
import getPlotDimensions from '../../utils/getPlotDimensions';
import _ from 'lodash';
import toastr from '../../utils/toastr';

export function setLoaderState(loaderState) {
    return { type: types.SET_LOADER_STATE, loaderState };
}

export function configureSourceID(sourceID) {
    return dispatch => {
        dispatch(setSourceID(sourceID));
        //reset configuration
        dispatch(setFilterLevel({}));
        dispatch(setchromosomeMode(false));
        dispatch(setBlockMode(false));

        console.log(sourceID)

        if (sampleSourceMapper[sourceID]) {
            const sampleDataMarkers = { ...sampleSourceMapper[sourceID] };
            dispatch(setRootMarkers(sampleDataMarkers));
        }
    }
}

export function setchromosomeMode(isChromosomeModeON) {
    return { type: types.SET_CHROMOSOME_MODE, isChromosomeModeON };
}

export function toggleTheme() {
    return { type: types.TOGGLE_DARK_THEME };
}

export function setBlockMode(isBlockModeON) {
    return { type: types.SET_BLOCK_MODE, isBlockModeON };
}

export function setSourceID(sourceID) {
    return { type: types.SET_SOURCEID, sourceID };
}

export function setConfiguration(configuration) {
    return { type: types.SET_CONFIGURATION, configuration };
}

export function setFilterLevel(filterLevel) {
    return { type: types.SET_FILTER_LEVEL, filterLevel };
};

export function toggleModalVisbility() {
    return { type: types.TOGGLE_MODAL };
}


export function setGenomicData(data) {
    const { genomeLibrary, alignmentList, linkageList = [], trackData = false, ...otherData } = data;
    //  Treading Dangerous Territory here by polluting the global name space 
    //  But this reduces the load placed on the redux and react global store
    window.synVisio = { genomeLibrary, alignmentList, linkageList, trackData };
    return { type: types.SET_GENOME_DATA, data: otherData };
}

export function setRootMarkers(markers, reversedMarkers = false) {

    let customReversedMarkers = _.clone(reversedMarkers);

    if (markers && !reversedMarkers) {
        customReversedMarkers = {};
        //create empty entry in reversed markers
        for (let key in markers) {
            customReversedMarkers[key] = [];
        }
    }

    return { type: types.SET_ROOT_MARKERS, markers, 'reversedMarkers': customReversedMarkers };
}

export function setALignmentList(alignmentList) {
    return { type: types.SET_ALIGNMENT_LIST, alignmentList };
}

export function setLinkageList(linkageList) {
    return { type: types.SET_LINKAGE_LIST, linkageList };
}

export function toggleTracks() {
    return { type: types.TOGGLE_TRACKS };
}

export function setMultiDualFilter(multiDualFilter) {
    return { type: types.SET_MULTI_DUAL_FILTER, multiDualFilter };
}

export function refineAlignmentList(filterLevel, alignmentList) {

    let updatedAlignmentList = _.map(alignmentList, (o) => {

        if (filterLevel.count != undefined && filterLevel.count.nominalValue > o.count) {
            o.hidden = true;
        }
        else if (filterLevel.score != undefined && filterLevel.score.nominalValue > o.score) {
            o.hidden = true;
        }
        else if (filterLevel.e_value != undefined && filterLevel.e_value.nominalValue > o.e_value && !filterLevel.e_value.adjustToZero) {
            o.hidden = true;
        }
        else if (filterLevel.source && filterLevel.source != o.source) {
            o.hidden = true;
        }
        else if (filterLevel.target && filterLevel.target != o.target) {
            o.hidden = true;
        }
        else if (filterLevel.alignment && !_.isEqual(o, filterLevel.alignment)) {
            o.hidden = true;
        }
        else {
            o.hidden = false;
        }
        return o;
    });

    return dispatch => {
        dispatch(setFilterLevel(filterLevel));
        dispatch(setALignmentList(updatedAlignmentList));
        dispatch(setchromosomeMode(!!(filterLevel.source && filterLevel.target)));
        dispatch(setBlockMode(!!(filterLevel.alignment)));
    };
}


export function filterData(sourceMarkers = [], targetMarkers = [], linkageMarkers = []) {

    const markers = { 'source': sourceMarkers, 'target': targetMarkers },
        linkageSet = { 'source': targetMarkers, 'target': linkageMarkers },
        alignmentList = window.synVisio.alignmentList,
        linkageList = window.synVisio.linkageList,
        updatedAlignmentList = processAlignment(markers, alignmentList),
        updatedLinkageList = processLinkage(linkageSet, linkageList);

    return dispatch => {
        let filterLevel = {};
        dispatch(setRootMarkers({ 'source': sourceMarkers, 'target': targetMarkers, 'linkage': linkageMarkers }));
        dispatch(setFilterLevel(filterLevel));
        dispatch(setALignmentList(updatedAlignmentList));
        dispatch(setLinkageList(updatedLinkageList));
    };
}


export function findGeneMatch(geneIds, cancelMatch = false) {

    let searchResult = [];

    if (cancelMatch) {
        return { type: types.SET_SEARCH_RESULT, searchResult };
    }

    else {

        let geneIDsList = geneIds.split(',').map((d) => d.trim());

        let matchingGeneList = geneIDsList.filter((d) => !!window.synVisio.genomeLibrary.get(d));

        if (geneIDsList.length == 0) {
            toastr["error"]("Please enter a gene ID", "ERROR");
        }
        else if (matchingGeneList.length == 0) {
            toastr["error"]("No genes found for given gene ID or IDs", "ERROR");
        }
        else {
            _.map(window.synVisio.alignmentList, (alignment) => {
                _.map(alignment.links, (o, linkID) => {
                    if (geneIDsList.indexOf(o.source) > -1 || geneIDsList.indexOf(o.target) > -1) {
                        searchResult.push({ ...alignment, 'matchingLinkID': linkID });
                    }
                })

            })
        }
        if (searchResult.length == 0) {
            toastr["error"]("Supplied genes dont have any alignments", "ERROR");
        }

        return { type: types.SET_SEARCH_RESULT, searchResult };
    }

}

export function hiveFilterData(markers) {

    let alignmentList = window.synVisio.alignmentList,
        updatedAlignmentList = [],
        noOfMarkers = Object.keys(markers).length;

    // if there are more than 2 markers go round calling alignments 
    // in sets of two with each with the one after it except for the last one which loops back to the first
    if (noOfMarkers > 2) {
        _.each(markers, (value, keyIndex) => {
            const nextIndex = ((noOfMarkers - 1) == keyIndex) ? 0 : (Number(keyIndex) + 1),
                tempMarkers = { 'source': markers[keyIndex], 'target': markers[nextIndex] };
            updatedAlignmentList.push({ source: keyIndex, target: nextIndex, 'alignmentList': processAlignment(tempMarkers, alignmentList) });
        });
    }
    else if (noOfMarkers == 2) {
        const tempMarkers = { 'source': markers[0], 'target': markers[1] };
        updatedAlignmentList.push({ source: 0, target: 1, 'alignmentList': processAlignment(tempMarkers, alignmentList) });
    }
    return dispatch => {
        dispatch(setRootMarkers(markers));
        dispatch(setHiveViewSelectedMarker(-1));
        dispatch(setALignmentList(updatedAlignmentList));
    };
}

export function treeFilterData(markers) {

    let alignmentList = window.synVisio.alignmentList,
        updatedAlignmentList = [],
        noOfMarkers = Object.keys(markers).length;

    // if there are more than 2 markers go round calling alignments 
    // in sets of two with each with the one after it until we reach the last one
    // loop runs only till last but one element since there is no mapping for the last row
    if (noOfMarkers > 2) {
        for (let keyIndex = 0; keyIndex < Object.keys(markers).length - 1; keyIndex++) {
            const nextIndex = keyIndex + 1,
                tempMarkers = { 'source': markers[keyIndex], 'target': markers[nextIndex] };
            updatedAlignmentList.push({ source: keyIndex, target: nextIndex, 'alignmentList': processAlignment(tempMarkers, alignmentList) });
        }
    }
    else if (noOfMarkers == 2) {
        const tempMarkers = { 'source': markers[0], 'target': markers[1] };
        updatedAlignmentList.push({ source: 0, target: 1, 'alignmentList': processAlignment(tempMarkers, alignmentList) });
    }
    return dispatch => {
        dispatch(setRootMarkers(markers));
        dispatch(setFilterLevel({}));
        dispatch(setALignmentList(updatedAlignmentList));
    };
}

export function setPlotProps(levelOrType, value) {
    const isLevel = (levelOrType == 'level');
    return dispatch => {
        let configurationStore = getPlotDimensions(value),
            markers = (isLevel && value) ? {} : { 'source': [], 'target': [] };
        const configuration = {
            ...configurationStore,
            filterLevel: {},
            isChromosomeModeON: false,
            isBlockModeON: false,
            markers,
            'alignmentList': [],
            'filterLevel': {}
        }
        dispatch(setConfiguration(configuration));
        if (isLevel) {
            dispatch({ type: types.SET_PLOT_LEVEL, value });
        }
        else {
            dispatch({ type: types.SET_PLOT_TYPE, value });
        }
    };
}

export function setMarkerEdge(value) {
    return { type: types.SET_MARKER_EDGE, value }
}

export function setAlignmentColor(value) {
    return { type: types.SET_ALIGNMENT_COLOR, value }
}


export function setMultiLevelType(value) {

    return dispatch => {
        let configurationStore = getPlotDimensions(value);
        const configuration = {
            ...configurationStore,
            filterLevel: {},
            isChromosomeModeON: false,
            isBlockModeON: false,
            markers: {},
            'alignmentList': [],
            'filterLevel': {}
        }
        dispatch(setConfiguration(configuration));
        dispatch({ type: types.SET_MULTI_TYPE, value });
    };
}


export function setTrackType(trackType) {
    return { type: types.SET_TRACK_TYPE, trackType };
}

export function setNormalizedState(isNormalized = false) {
    return { type: types.SET_NORMALIZED, isNormalized };
}

export function setMarkerScale(showScale = true) {
    return { type: types.SET_MARKER_SCALE, showScale };
}

export function setChromosomeLabelsState(chromosomeLabelsON = false) {
    return { type: types.SET_CHROMOSOME_LABELS_STATE, chromosomeLabelsON };
}

export function setHiveViewSelectedMarker(markerID) {
    return { type: types.SET_HIVE_VIEW_SELECTED, markerID };
}











