import React, { Component } from 'react';
import { getGenomicsData } from '../utils/fetchData';
import { hashHistory } from 'react-router';
import {
    Loader, HiveView, TreeView, PlotCharacteristics,
    SingleLevel, DownloadSvg, CubeView, GeneSearch, SaveModal
} from '../components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    configureSourceID, setLoaderState,
    setGenomicData, setALignmentList, setConfiguration
} from '../redux/actions/actions';

import { initializeSnapshot, updateSnapshot } from '../utils/snapshot';


class Dashboard extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        // get the source name based on window query params
        let { sourceID } = this.props.params;
        const { multiLevel, actions, isSnapShotAvailable } = this.props,
            { configureSourceID, setLoaderState,
                setGenomicData, setConfiguration } = actions;

        // attach snapshot to the dashboard
        if (isSnapShotAvailable) {
            initializeSnapshot(true, 1000, (data) => { setConfiguration(data) });
        }

        if (sourceID != 'uploaded-source') {
            // Turn on loader
            setLoaderState(true);
            if (!sourceID) {
                // If sourceID is not set then fetch default that is set in the initial state of the application
                hashHistory.push('Dashboard/' + this.props.sourceID);
                sourceID = this.props.sourceID;
            }
            else {
                // update the sourceID set in the state with the new sourceID
                configureSourceID(sourceID, multiLevel);
            }
            getGenomicsData(sourceID).then((data) => {
                // set the genomic data
                setGenomicData(data);
            }).finally(() => {
                // Turn off the loader
                setLoaderState(false);
            });
        }
    }

    componentWillUnmount() {
        // clear alignment list 
        this.props.actions.setALignmentList([]);
    }

    render() {
        let { loaderState, configuration, genome = {},
            isModalVisible, multiLevel, multiLevelType, plotType } = this.props;

        updateSnapshot(configuration);

        return (
            <div className='dashboard-root m-t'>
                {isModalVisible && <SaveModal />}
                {!loaderState ?
                    <div className='dashboard-container'>
                        {genome.chromosomeMap ?
                            <div>
                                <DownloadSvg />
                                <PlotCharacteristics
                                    multiLevel={multiLevel}
                                    multiLevelType={multiLevelType}
                                    plotType={plotType}
                                    configuration={configuration} />
                                {!multiLevel && <GeneSearch />}
                                {multiLevel ?
                                    <div>
                                        {multiLevelType == 'hive' ?
                                            <HiveView configuration={configuration} /> :
                                            multiLevelType == 'cube' ?
                                                <CubeView configuration={configuration} /> :
                                                <TreeView configuration={configuration} />}
                                    </div>
                                    : <SingleLevel
                                        plotType={plotType}
                                        configuration={configuration} />}
                            </div>
                            : <h2 className='text-danger text-xs-center m-t-lg'>No data found</h2>}
                    </div>
                    : <Loader />}
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            configureSourceID,
            setLoaderState,
            setGenomicData,
            setALignmentList,
            setConfiguration
        }, dispatch)
    };
}

function mapStateToProps(state) {
    return {
        sourceID: state.oracle.sourceID,
        isModalVisible: state.oracle.isModalVisible,
        loaderState: state.oracle.loaderState,
        configuration: state.oracle.configuration,
        multiLevel: state.oracle.multiLevel,
        multiLevelType: state.oracle.multiLevelType,
        plotType: state.oracle.plotType,
        genome: state.genome,
        isSnapShotAvailable: state.oracle.isSnapShotAvailable
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);



