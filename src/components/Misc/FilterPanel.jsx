import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import sortAlphaNum from '../../utils/sortAlphaNum';
import {
    filterData, toggleTracks,
    setNormalizedState, setMarkerScale
} from '../../redux/actions/actions';

class FilterPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hideUnalignedRegions: false
        }
        this.onSubmit = this.onSubmit.bind(this);
        this.onToggleTrack = this.onToggleTrack.bind(this);
        this.toggleCheckboxChange = this.toggleCheckboxChange.bind(this);
    }

    toggleCheckboxChange(event) {
        const { hideUnalignedRegions } = this.state, { isNormalized = false, showScale } = this.props;

        if (event.target.id == 'markerNormalize') {
            this.props.setNormalizedState(!isNormalized);
        }
        else if (event.target.id == 'markerScale') {
            this.props.setMarkerScale(!showScale);
        }
        else {
            this.setState({ 'hideUnalignedRegions': !hideUnalignedRegions });
        }

    }

    componentDidMount() {
        const { markers = { 'source': [], 'target': [], 'linkage': [] } } = this.props;

        $('.sourceChromosomeSelect')
            .selectpicker({
                'actionsBox': true,
                'iconBase': 'icon',
                'tickIcon': 'icon-check',
                'selectedTextFormat': 'count > 2'
            })
            .selectpicker('val', markers.source);

        $('.targetChromosomeSelect')
            .selectpicker({
                'actionsBox': true,
                'iconBase': 'icon',
                'tickIcon': 'icon-check',
                'selectedTextFormat': 'count > 2'
            })
            .selectpicker('val', markers.target);


        $('.linkageChromosomeSelect')
            .selectpicker({
                'actionsBox': true,
                'iconBase': 'icon',
                'tickIcon': 'icon-check',
                'selectedTextFormat': 'count > 2'
            })
            .selectpicker('val', markers.linkage);
    }

    componentDidUpdate() {
        const { markers = { 'source': [], 'target': [] } } = this.props;
        $('.sourceChromosomeSelect').selectpicker('refresh').selectpicker('val', markers.source);
        $('.targetChromosomeSelect').selectpicker('refresh').selectpicker('val', markers.target);
        $('.linkageChromosomeSelect').selectpicker('refresh').selectpicker('val', markers.linkage);
    }

    componentWillUnmount() {
        $('.sourceChromosomeSelect').selectpicker('destroy');
        $('.targetChromosomeSelect').selectpicker('destroy');
        $('.linkageChromosomeSelect').selectpicker('destroy');
    }
    onSubmit(e) {
        e.preventDefault();
        const sourceMarkers = $('.sourceChromosomeSelect').selectpicker('val'),
            targetMarkers = $('.targetChromosomeSelect').selectpicker('val'),
            linkageMarkers = $('.linkageChromosomeSelect').selectpicker('val');
        //  if markers lists are null set them to empty lists
        this.props.filterData(!!sourceMarkers ? sourceMarkers : [], !!targetMarkers ? targetMarkers : [], !!linkageMarkers ? linkageMarkers : [], {}, false);
    }

    onToggleTrack(e) {
        e.preventDefault();
        this.props.toggleTracks();
    }

    render() {

        let { chromosomeMap = {}, isNormalized = false, plotType } = this.props;

        const [chromosomeOptions, linkageOptions] = _.partition([...chromosomeMap], ([e, value]) => e.indexOf('LG') == -1);

        // sort chromosome map 
        // Zero is passed to the sorting function so that sorting happens based on the 0th value
        //  which is the actual chromosome identifier
        let chromosomeMapList = chromosomeOptions.sort(sortAlphaNum(0)),
            linkageMapList = linkageOptions.sort(sortAlphaNum(0));

        // create list of options
        const chrOptions = chromosomeMapList.map((value, index) => {
            return <option key={index} value={value[0]}>{value[0]}</option>;
        }),
            linkageGroupOptions = linkageMapList.map((value, index) => {
                return <option key={index} value={value[0]}>{value[0]}</option>;
            });

        const { trackData = [] } = window.synVisio || {};
        // see if track data is available
        const isTrackDataAvailable = _.reduce(trackData, (acc, d) => (!!d || acc), false);

        return (
            <div id='filter-panel-root' className='container-fluid'>
                <form className="filter-panel-container">
                    <div className="col-sm-12">
                        <label htmlFor="sourceChromosomes">Source Chromosomes</label>
                        <select className="sourceChromosomeSelect" multiple title="Select Chromosomes...">
                            {chrOptions}
                        </select>

                    </div>
                    <div className="col-sm-12">
                        <label htmlFor="targetChromosomes">Target Chromosomes</label>
                        <select className="targetChromosomeSelect" multiple title="Select Chromosomes...">
                            {chrOptions}
                        </select>
                    </div>

                    <div className="col-sm-12">
                        <label htmlFor="linkageChromosomes">Linkage Group Set</label>
                        <select className="linkageChromosomeSelect" multiple title="Select Linkage IDs...">
                            {linkageGroupOptions}
                        </select>
                    </div>

                    <button type="submit" className="btn btn-primary-outline" onClick={this.onSubmit}>
                        GO <span className="icon icon-cw"></span>
                    </button>
                </form>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        filterData: bindActionCreators(filterData, dispatch),
        toggleTracks: bindActionCreators(toggleTracks, dispatch),
        setNormalizedState: bindActionCreators(setNormalizedState, dispatch),
        setMarkerScale: bindActionCreators(setMarkerScale, dispatch)
    };
}

function mapStateToProps(state) {
    return {
        chromosomeMap: state.genome.chromosomeMap,
        markers: state.oracle.configuration.markers,
        isNormalized: state.oracle.configuration.isNormalized,
        showScale: state.oracle.configuration.showScale,
        plotType: state.oracle.plotType
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(FilterPanel);

