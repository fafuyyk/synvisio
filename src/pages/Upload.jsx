import React, { Component } from 'react';
import { FileUpload, RadioButton } from '../components';
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
      { processScaffolds, showAllScaffolds } = this.state,
      { configureSourceID, setGenomicData, setLoaderState } = actions;

    // Turn on loader to indicate file uploading and processing 
    setLoaderState(true);
    configureSourceID('bn', multiLevel);

    // check the number of tracks files that are available to process
    let trackFiles = _.map([0, 1, 2, 3], (d) => document.getElementById('track-file-' + d).files.length > 0);

    // check if color palette is available 
    let isColorMapAvailable = document.getElementById('color-map-file').files.length > 0;

    // load the coordinate file
    getFile('coordinate-file')
      // process the file in a seperate thread
      .then((response) => { return processFile(response, 'gff', { processScaffolds }) })
      // store the data and then load the collinear file
      .then((data) => {
        datastore = Object.assign(datastore, { ...data });
        return getFile('collinear-file');
      })
      // process the collinear file
      .then(((response) => { return processFile(response, 'collinear') }))
      // store the collinear data and load the track file if one is provided
      .then((data) => {

        let { information, alignmentList, uniqueIDList } = data, { chromosomeMap } = datastore;

        if (!showAllScaffolds) {
          [...chromosomeMap].map((entry) => {
            if (uniqueIDList.indexOf(entry[0]) == -1) {
              chromosomeMap.delete(entry[0]);
              console.log('deleted entry', entry[0]);
            }
          });
        }
        datastore = Object.assign({}, datastore, { information, alignmentList, chromosomeMap });
        return isColorMapAvailable ? getFile('color-map-file') : Promise.resolve(false);
      })
      .then((colorData) => {
        if (colorData) {
          let colorMap = {};
          colorData.trim().split('\n').map((d) => d.split('\t')).map((e) => colorMap[e[0]] = e[1]);
          datastore.colorMap = colorMap;
        }
        return trackFiles[0] ? getFile('track-file-0') : Promise.resolve(false);
      })
      // process 1st trackfile data if present
      .then((data) => {
        return trackFiles[0] ? processFile(data, 'track', { processScaffolds }) : Promise.resolve(false);
      })
      .then((trackData) => {
        datastore.trackData.push(trackData);
        // update the sourceID set in the state with the new sourceID
        configureSourceID('uploaded-source', multiLevel);
        // set the genomic data
        setGenomicData(datastore);
      })
      .catch(() => {
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
            <FileUpload id='linkage-group-fle' label='Linkage Group File' />
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

