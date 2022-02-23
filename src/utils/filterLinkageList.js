import sortAlphaNum from './sortAlphaNum';

export default (markers, linkageList) => {

    let sourceKeyList = markers.source,
        targetKeyList = markers.target,
        filteredList = [];

    _.each(linkageList, (alignment) => {
        let { locus, linkageID } = alignment;
        // add boolean to show or hide alignment
        alignment.hidden = false;
        // add boolean to highlight an alignment 
        alignment.highlight = false;
        if (locus && linkageID) {
            // if the alignment is from source to target we return the alignment directly 
            if ((sourceKeyList.indexOf(locus) > -1) && (targetKeyList.indexOf(linkageID) > -1)) {
                filteredList.push(alignment);
            }
        }
    });
    return filteredList.sort(sortAlphaNum('locus'));
}