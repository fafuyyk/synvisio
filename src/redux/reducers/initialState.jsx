import getPlotDimensions from '../../utils/getPlotDimensions';
import defaultDataSource from '../../utils/defaultDataSource';
const configuration = getPlotDimensions();

export default {
  oracle: {
    isDark: true,
    isModalVisible: false,
    isSnapShotAvailable: false,
    sourceID: defaultDataSource,
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
      showScale: true,
      markerEdge: 'rounded', // rounded or square
      alignmentColor: 'tenColor', // tenColor or orientation
      isChromosomeModeON: false,
      showTracks: false,
      isBlockModeON: false,
      'markers': { 'source': [], 'target': [] }, // default preset markers are loaded from the defaultDatasetMap
      'reversedMarkers': { 'source': [], 'target': [] },//same structure but array contains the marker that is reversed
      'alignmentList': [],
      'filterLevel': {}
    }
  }
};
