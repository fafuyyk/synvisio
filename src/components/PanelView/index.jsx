import React, { Component } from 'react';
import { connect } from 'react-redux';
import { scaleLinear, scaleLog, schemeCategory10 } from 'd3';
import _ from 'lodash';
import { RadioButton } from '../';
import Slider from 'rc-slider';

class PanelView extends Component {

    constructor(props) {
        super(props);

        this.optionLabels = {
            'count': 'Count',
            'score': 'Match Score',
            'e_value': 'E value'
        };

        this.state = {
            selectedRadio: 'count'
        };

        this.scales = {};

        this.radioChange = this.radioChange.bind(this);
        this.onSliderChange = this.onSliderChange.bind(this);
    }

    radioChange(event) {
        this.setState({ selectedRadio: event.target.value });
    }

    onSliderChange(value) {
        console.log(value);
    }

    render() {

        let { configuration } = this.props;
        let { selectedRadio } = this.state;

        let leftWidth = 260;
        let availableWidth = configuration.panelView.width - leftWidth;

        let style = {
            width: (leftWidth / 2) + 'px',
            height: configuration.panelView.height * 0.80,
            margin: configuration.panelView.height * 0.1 + "px 0px"
        };
        let labelContainerStyle = {
            width: (leftWidth / 4) + 'px',
            height: configuration.panelView.height * 0.70,
            margin: ((configuration.panelView.height * 0.1) + "px 0px ") + ((configuration.panelView.height * 0.2) + "px 0px")
        };
        let sliderStyle = {
            ...labelContainerStyle,
            paddingLeft: (leftWidth / 8) + 'px'
        }

        const margin = { top: 100, right: 40, bottom: 40, left: 40 },
            width = availableWidth - margin.left - margin.right,
            height = configuration.panelView.height - margin.top - margin.bottom;

        let { alignmentList = [] } = configuration;

        let valueList = alignmentList.map((o) => o[selectedRadio]).sort((a, b) => a - b);

        let min = valueList[0],
            max = valueList[valueList.length - 1];

        if (selectedRadio == 'e_value') {
            min = valueList[_.findIndex(valueList, (o) => o != 0)];
            min = Math.max((max / 1.0e300), min);
        }

        this.scales.x = scaleLinear()
            .domain([0, alignmentList.length])
            .range([0, width]);

        this.scales.y = selectedRadio == 'e_value' ? scaleLog().base(Math.E) : scaleLinear();
        this.scales.y = this.scales.y.domain([min, max])
            .range([selectedRadio == 'e_value' ? height - 2 : height, 0]);

        let dotList = alignmentList.map((alignment, index) => {

            const sourceIndex = configuration.markers.source.indexOf(alignment.source),
                style = {
                    'fill': (sourceIndex == -1) ? '#2a859b' : schemeCategory10[sourceIndex % 10]
                };

            let cy;

            if ((selectedRadio == 'e_value' && alignment[selectedRadio] == 0) || (selectedRadio == 'e_value' && alignment[selectedRadio] < min)) {
                cy = height;

            }
            else {
                cy = this.scales.y(alignment[selectedRadio]);
            }

            return <circle
                key={'scatter-plot-' + index}
                className='scatter-plot-dot'
                r='2.5'
                cx={this.scales.x(index)}
                cy={cy}
                style={style}>
                <title>
                    {alignment.source + " => " + alignment.target +
                        "\n type : " + alignment.type +
                        "\n E value : " + alignment.e_value +
                        "\n score : " + alignment.score +
                        "\n count : " + alignment.count}
                </title>
            </circle>
        });

        // Append axises to the same list
        dotList.push(<line key='panel-x' className='panel-axis' x1={this.scales.x(0) - 10} y1={this.scales.y(min) + 10} x2={this.scales.x(alignmentList.length)} y2={this.scales.y(min) + 10}></line>);
        dotList.push(<line key='panel-y' className='panel-axis' x1={this.scales.x(0) - 10} y1={this.scales.y(min) + 10} x2={this.scales.x(0) - 10} y2={this.scales.y(max)}></line>);

        // Append axis labels to the same list
        dotList.push(<text key='label-x' className='label-x panel-label' x={this.scales.x(alignmentList.length) - 75} y={this.scales.y(min) + 30} >Alignments</text>);
        dotList.push(<text key='label-y' className='label-y panel-label' x={this.scales.x(0) - (this.optionLabels[selectedRadio].length * 8)} y={this.scales.y(max) - 20} >{this.optionLabels[selectedRadio]}</text>);


        return (
            <div className='panelViewRoot' >
                <div className='toggle-container' style={style}>
                    {_.map(this.optionLabels, (value, key) => {
                        return <RadioButton
                            key={key}
                            value={key}
                            id={key}
                            label={value}
                            onChange={this.radioChange}
                            checked={this.state.selectedRadio == key} />
                    })}
                </div>
                <div className='toggle-container' style={sliderStyle}>
                    <Slider min={0} max={10} defaultValue={0} vertical={true} onAfterChange={this.onSliderChange} />
                </div>
                <div className='toggle-container slider-label-container' style={labelContainerStyle}>
                    <p className='slider-top-label'>MAX</p>
                    <p className='slider-bottom-label'>MIN</p>
                </div>
                <svg width={availableWidth} height={configuration.panelView.height} >
                    <g transform={"translate(" + margin.left + "," + margin.top / 2 + ")"}>
                        {dotList}
                    </g>
                </svg>

            </div>
        );
    }
}

function mapStateToProps(state) {
    return { configuration: state.oracle.configuration };
}

export default connect(mapStateToProps)(PanelView);