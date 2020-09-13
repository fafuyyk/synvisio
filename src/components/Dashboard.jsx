import React, { Component } from 'react';
import { getGenomicsData } from '../utils/fetchData';
import {
    Loader, HiveView, TreeView, PlotCharacteristics,
    SingleLevel, DownloadSvg, CubeView, GeneSearch, SaveModal
} from '.';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    configureSourceID, setLoaderState,
    setGenomicData, setALignmentList, setConfiguration
} from '../redux/actions/actions';

class Dashboard extends Component {

    componentDidMount() {
        const { multiLevel, actions } = this.props,
            { configureSourceID, setLoaderState,
                setGenomicData } = actions;

        let sourceID = 'bn';
        // Turn on loader
        setLoaderState(true);
        // update the sourceID set in the state with the new sourceID
        configureSourceID(sourceID, multiLevel);
        getGenomicsData(sourceID).then((data) => {
            // set the genomic data
            setGenomicData(data);
        }).finally(() => {
            // Turn off the loader
            setLoaderState(false);
        });
    }

    componentWillUnmount() {
        // clear alignment list 
        this.props.actions.setALignmentList([]);
    }

    render() {
        let { loaderState, configuration, genome = {},
            isModalVisible, multiLevel,
            multiLevelType, plotType } = this.props;

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
        isSnapShotAvailable: state.oracle.isSnapShotAvailable,
        genome: state.genome,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);



