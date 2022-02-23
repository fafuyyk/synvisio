import React, { Component } from 'react';
import { FileUpload } from '../components';
import getFile from '../utils/getFile';
import processFile from '../utils/processFile';
import toastr from '../utils/toastr';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { configureSourceID, setGenomicData, setLoaderState } from '../redux/actions/actions';

class Upload extends Component {

  constructor(props) {
    super(props);
    this.onUpload = this.onUpload.bind(this);
  }


  onUpload() {

    let datastore = { trackData: [], colorMap: {} };
    const { actions, multiLevel } = this.props,
      { configureSourceID, setGenomicData, setLoaderState } = actions;

    // Turn on loader to indicate file uploading and processing 
    setLoaderState(true);
    configureSourceID('lentils_lg');

    // check if linkage group file is available 
    let isLinkageAvailable = document.getElementById('linkage-file').files.length > 0;

    // load the coordinate file
    getFile('coordinate-file')
      // process the file in a seperate thread
      .then((response) => { return processFile(response, 'gff', { 'processScaffolds': false }) })
      // store the data and then load the collinear file
      .then((data) => {
        datastore = Object.assign(datastore, { ...data });
        return getFile('collinear-file');
      })
      // process the collinear file
      .then(((response) => { return processFile(response, 'collinear') }))
      // store the collinear data and load the track file if one is provided
      .then((data) => {
        let { alignmentList, uniqueIDList } = data, { chromosomeMap } = datastore;

        // remove chromosomes with no alignment in them
        [...chromosomeMap].map((entry) => {
          if (uniqueIDList.indexOf(entry[0]) == -1) {
            chromosomeMap.delete(entry[0]);
            console.log('deleted entry', entry[0]);
          }
        });

        datastore = Object.assign({}, datastore, { alignmentList, chromosomeMap });
        return isLinkageAvailable ? getFile('linkage-file') : Promise.resolve(false);
      })
      // process the collinear file
      .then(((response) => { return isLinkageAvailable ? processFile(response, 'linkage') : Promise.resolve(false) }))
      .then((linkageData) => {

        debugger

        let trackData = [false];

        if (isLinkageAvailable) {
          const { newMap, newLibrary, linkageList } = linkageData,
            { chromosomeMap, genomeLibrary } = datastore;
          datastore.chromosomeMap = new Map([...chromosomeMap, ...newMap]);
          datastore.genomeLibrary = new Map([...genomeLibrary, ...newLibrary]);
          // copy track data
          trackData = linkageData.trackData;
          datastore = Object.assign({}, datastore, { linkageList });
        }

        // update the sourceID set in the state with the new sourceID
        configureSourceID('uploaded-source');
        // set the genomic data
        setGenomicData({ ...datastore, trackData });
      })
      .catch(() => {
        debugger
        toastr["error"]("Failed to upload the files , Please try again.", "ERROR");
      })
      .finally(() => { setLoaderState(false); });

  }

  render() {

    const { sourceID = '', loaderState = false } = this.props;

    return (
      <div className="configuration-container">
        <div className="container">
          <div className='upload-panel'>
            <h2 className='text-primary m-t-lg configuration-sub-title'>Upload Input Files</h2>
            <FileUpload id='collinear-file' label='MCScanX Collinearity File' />
            <FileUpload id='coordinate-file' label='GFF File' />

            <h4 className="sub-info"> Upload a  the linkage group file in a tab seperated format as shown in this<a target='_blank' href='./assets/files/sample_linkage.txt'> sample file</a>.</h4>

            <FileUpload id='linkage-file' label='Linkage Group File' />
            {loaderState && <h4 className='loading-text'>Loading data...</h4>}
            <button className="btn btn-primary-outline m-t" onClick={this.onUpload}> UPLOAD </button>
          </div>
          {sourceID == 'uploaded-source' && <div className="alert alert-success m-t m-b">
            <strong>Upload Complete !</strong> Your files have been processed . Head over to the <strong>dashboard</strong> to view the results.
          </div>}
        </div>
      </div>
    )
  }
};


function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ configureSourceID, setGenomicData, setLoaderState }, dispatch)
  };
}

function mapStateToProps(state) {
  return {
    sourceID: state.oracle.sourceID,
    multiLevel: state.oracle.multiLevel,
    multiLevelType: state.oracle.multiLevelType,
    plotType: state.oracle.plotType,
    loaderState: state.oracle.loaderState
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Upload);

