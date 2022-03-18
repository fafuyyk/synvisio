/*global $*/
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleModalVisbility } from '../../redux/actions/actions';
import Loading from 'react-loading';
import uniqid from 'uniqid';
import ParseSVG from '../../utils/ParseSVG';
import toastr from '../../utils/toastr';
import svgSaver from '../../utils/saveSVGasPNG';
import { saveAs } from 'file-saver';

// sample Modal than can be used when needed but is not in use currently

class Modal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedType: 'SVG',
            loaderON: false,
            exportScale: 1
        };
        this.closeModal = this.closeModal.bind(this);
        this.selectChange = this.selectChange.bind(this);
        this.downloadImage = this.downloadImage.bind(this);
    }

    selectChange(event) {
        this.setState({ [event.target.id]: event.target.value })
    }

    closeModal(event) {
        event.preventDefault();
        this.props.actions.toggleModalVisbility();
    }

    downloadImage() {

        // toggle loader ON
        this.setState({ loaderON: true });

        const { selectedType, exportScale = 1 } = this.state;

        let svgSelector = document.getElementsByClassName('exportable-svg');

        toastr["info"]("Thanks for using SynVisio, Please consider citing our work if you are using the images in a publication. The citation can be found on the home page. Please wait for the download to begin...", "Export");


        const chartHeightShift = +jQuery('.genomeViewSVG').attr('height') - 35;
        // Move the legends closer to the end and then reset them after the download 
        let firstLegendTransformValues = jQuery('.legendSequential').attr('transform').slice(10, -1).split(','),
            secondLegendTransformValues = jQuery('.legendSequentialDIS').attr('transform').slice(10, -1).split(',');

        jQuery('.legendSequential').attr('transform', 'translate(' + firstLegendTransformValues[0] + "," + (+firstLegendTransformValues[1] + chartHeightShift) + ")");
        jQuery('.legendSequentialDIS').attr('transform', 'translate(' + secondLegendTransformValues[0] + "," + (+secondLegendTransformValues[1] + chartHeightShift) + ")");

        Promise.all([ParseSVG(svgSelector[0]), ParseSVG(svgSelector[1])]).then(([syntenyPlot, LinkagePlot]) => {

            const fileName = "synvisio-export-" + selectedType + "-" + uniqid() + (selectedType == "SVG" ? '.svg' : '.png');

            let syntenyXML = (new XMLSerializer()).serializeToString(syntenyPlot).split("xmlns=\"http://www.w3.org/1999/xhtml\"").join(""),
                linkageXML = (new XMLSerializer()).serializeToString(LinkagePlot).split("xmlns=\"http://www.w3.org/1999/xhtml\"").join("");


            const syntenyChartHeight = +syntenyXML.slice(syntenyXML.indexOf('height=') + 8, syntenyXML.indexOf('" style=')),
                syntenyChart = syntenyXML.slice(syntenyXML.indexOf('<g'), syntenyXML.indexOf('</svg>'));

            let linkageChartPartOne = linkageXML.slice(0, linkageXML.indexOf('<g>')),
                // we remove one <g> tag and replace it with our own one with transform prop in it   
                linkageChartPartTwo = linkageXML.slice(linkageXML.indexOf('<g>') + 3);

            // First increase the height on the linkage chart as it will be the final output
            let updatedLinkageChartPartOne = linkageChartPartOne.slice(0, linkageChartPartOne.indexOf('height=') + 7) + '"' + syntenyChartHeight * 2.25 + '"' + linkageChartPartOne.slice(linkageChartPartOne.indexOf('" style') + 1);


            updatedLinkageChartPartOne = updatedLinkageChartPartOne.split(".genomeViewRoot").join('').split('</style>').join("  .genomeViewSVG .link-polygon { stroke: none; fill-opacity: 0.6; pointer-events: none; } </style>");






            let finalChart = updatedLinkageChartPartOne + syntenyChart + "<g transform='translate(0," + (syntenyChartHeight - 35) + ")'>" + linkageChartPartTwo;

            var blob = new Blob([finalChart], { type: "image/svg+xml" });
            saveAs(blob, fileName);


            jQuery('.legendSequential').attr('transform', 'translate(' + firstLegendTransformValues[0] + "," + (+firstLegendTransformValues[1]) + ")");
            jQuery('.legendSequentialDIS').attr('transform', 'translate(' + secondLegendTransformValues[0] + "," + (+secondLegendTransformValues[1]) + ")");


            this.setState({ 'loaderON': false });
        });
    }


    render() {

        const { selectedType, exportScale, loaderON } = this.state,
            exportable_elements = _.map(document.getElementsByClassName('exportable-svg'), (element) => element.id);

        return (
            <div className='cc-modal-root'>
                <div className='modal-main'>
                    <button type="button" className="close" onClick={this.closeModal}>
                        <span>×</span>
                    </button>
                    <h3 className='text-center'>Download Image Panel</h3>
                    <div className='info-panel-inner text-center'>
                        {exportable_elements.length > 0 ?
                            <div className='m-a'>
                                <p className='text-warning text-left info-p'>Please consider citing our work if you are using the images in a publication.</p>
                                <p className='text-warning text-left info-p m-t-0'>The citation can be found on the home page.</p>
                                <div>
                                    <button className="btn btn-primary-outline" onClick={this.downloadImage}>
                                        DOWNLOAD
                                        {loaderON && <Loading type='spin' className='download-loader' height='25px' width='25px' color='#d6e5ff' delay={-1} />}
                                    </button>
                                </div>
                            </div>
                            : <h3 className='text-warning'>No Images present to download, Please generate an image first.</h3>}
                    </div>

                </div>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ toggleModalVisbility }, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(Modal);






