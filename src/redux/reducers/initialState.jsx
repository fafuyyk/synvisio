import getPlotDimensions from '../../utils/getPlotDimensions';

const configuration = getPlotDimensions();

export default {
  oracle: {
    isDark: false,
    isModalVisible: false,
    isSnapShotAvailable: false,
    sourceID: 'lentils_lg',
    searchResult: [],
    multiLevel: false,
    multiLevelType: 'tree',
    plotType: 'dashboard',
    trackType: [{ 'type': 'track-heatmap', 'color': 'red' },
    { 'type': 'track-heatmap', 'color': 'red' },
    { 'type': 'track-heatmap', 'color': 'red' },
    { 'type': 'track-heatmap', 'color': 'red' }],
    loaderState: false,
    configuration: {
      ...configuration,
      showScale: false,
      markerEdge: 'rounded', // rounded or square
      alignmentColor: 'tenColor', // tenColor or orientation
      markerAlternateColor: false,
      isChromosomeModeON: false,
      showTracks: false,
      isBlockModeON: false,
      'markers': { 'source': [], 'target': [] }, // default preset markers are loaded from the sampleSourceMapper
      'reversedMarkers': { 'source': [], 'target': [] },//same structure but array contains the marker that is reversed
      'alignmentList': [],
      'filterLevel': {}
    }
  }
};
