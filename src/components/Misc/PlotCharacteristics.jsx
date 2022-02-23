import React, { Component } from 'react';
import { RadioButton } from '../';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    setPlotProps, setTrackType, setMultiLevelType,
    setMarkerEdge, setAlignmentColor
} from '../../redux/actions/actions';

class PlotCharacterisitics extends Component {

    constructor(props) {
        super(props);
        this.state = { 'currentTrack': 0 };
    }


    onTrackTypeChange = (event) => {
        const trackId = event.target.id, { currentTrack } = this.state;
        let { trackType } = this.props;

        if (trackId == 'track-select-color') {
            trackType[currentTrack].color = event.target.value;
        }
        else {
            trackType[currentTrack].type = event.target.value;
        }
        this.props.actions.setTrackType(_.cloneDeep(trackType));
    }


    radioChange = (event) => {
        const value = event.target.value;
        if (value.indexOf('level') > -1) {
            this.props.actions.setPlotProps('level', value == 'level-multi');
        }
        else {
            this.props.actions.setPlotProps('type', value);
        }
    }

    markerEdgeRadio = (event) => { this.props.actions.setMarkerEdge(event.target.value) }
    alignmentColorRadio = (event) => { this.props.actions.setAlignmentColor(event.target.value) }
    multiRadioChange = (event) => { this.props.actions.setMultiLevelType(event.target.value) }

    render() {

        const { multiLevel, multiLevelType,
            trackType, configuration, plotType } = this.props,
            { currentTrack } = this.state;

        const { markerEdge = 'rounded', alignmentColor = 'tenColor' } = configuration;

        return (
            <div className='plot-type-panel'>

                <div className='small-wrapper-header'>
                    <h4>Chart Configuration
                        <span className="icon icon-chevron-right"></span>
                    </h4>
                </div>

                <div className='small-wrapper-inner'>
                    <div>
                        <span className='text-primary info-text-message p-b-0'>Chromosome Marker Edge Style </span>
                        <div>
                            <RadioButton value={'rounded'} id={'rounded'} className='conf-radio' name='marker-edge-radio'
                                label={"Rounded Edges"}
                                onChange={this.markerEdgeRadio}
                                checked={markerEdge == 'rounded'} />
                            <RadioButton value={'square'} id={'square'} className='conf-radio' name='marker-edge-radio'
                                label={"Square Edges"}
                                onChange={this.markerEdgeRadio}
                                checked={markerEdge == 'square'} />
                        </div>
                    </div>
                    <div>
                        <span className='text-primary info-text-message p-b-0'> Alignment Link Color Configuration </span>
                        <div>
                            <RadioButton value={'tenColor'} id={'tenColor'} className='conf-radio' name='alignment-color-select'
                                label={"Chromosome Source (repeating 10 color scale)"}
                                onChange={this.alignmentColorRadio}
                                checked={alignmentColor == 'tenColor'} />
                            <RadioButton value={'orientation'} id={'orientation'} className='conf-radio' name='alignment-color-select'
                                label={"Alignment Orientation regular(blue) or reversed(red)"}
                                onChange={this.alignmentColorRadio}
                                checked={alignmentColor == 'orientation'} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            setPlotProps,
            setTrackType,
            setMultiLevelType,
            setMarkerEdge,
            setAlignmentColor
        }, dispatch)
    };
}

function mapStateToProps(state) {
    return { trackType: state.oracle.trackType };
}


export default connect(mapStateToProps, mapDispatchToProps)(PlotCharacterisitics);




