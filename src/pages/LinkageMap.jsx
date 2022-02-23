import React, { Component } from 'react';
import { getGenomicsData } from '../utils/fetchData';
import { Loader, LinkageView, GenomeView, AdvancedFilterPanel, FilterPanel, PlotCharacteristics } from '../components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { configureSourceID, setLoaderState, setGenomicData, setALignmentList, setConfiguration } from '../redux/actions/actions';
import _ from 'lodash';
class LinkageMap extends Component {

    componentDidMount() {

        // get the source name based on window query params
        let { sourceID = 'lentils_lg' } = this.props.params,
            { actions } = this.props, { configureSourceID, setLoaderState, setGenomicData } = actions;

        if (sourceID != 'uploaded-source') {
            if (!sourceID) {
                // If sourceID is not set then fetch default that is set in the initial state of the application
                hashHistory.push('dashboard/' + this.props.sourceID);
                sourceID = this.props.sourceID;
            }
            else {
                // update the sourceID set in the state with the new sourceID
                configureSourceID(sourceID);
            }
            // Turn on loader
            setLoaderState(true);
            getGenomicsData(sourceID).then((data) => {
                // set the genomic data
                setGenomicData({ ...data });
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

        let { loaderState, configuration, genome = {}, sourceID, multiLevel, plotType, multiLevelType } = this.props,
            { alignmentList = [], linkageList = [] } = configuration;

        // transfer the colormap from genome to configuration
        configuration['colorMap'] = genome.colorMap || {};

        return (
            <div className='dashboard-root m-t'>
                <div>
                    <PlotCharacteristics
                        multiLevel={multiLevel}
                        multiLevelType={multiLevelType}
                        plotType={plotType}
                        configuration={configuration} />
                </div>

                <div className="graphic-container text-xs-center">
                    <FilterPanel />
                </div>
                <AdvancedFilterPanel />
                {!loaderState ?
                    <div className='dashboard-container m-t-lg'>
                        {(alignmentList.length > 0) &&
                            <div>
                                <GenomeView plotType={'linearplot'} configuration={configuration} />
                                {linkageList.length > 0 && <LinkageView sourceID={sourceID} plotType={'linearplot'} configuration={configuration} linkageData={linkageList} />}
                            </div>}
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
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(LinkageMap);


