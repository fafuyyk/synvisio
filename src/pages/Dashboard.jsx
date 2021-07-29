import React, { Component } from 'react';
import { getGenomicsData } from '../utils/fetchData';
import processAncestorData from '../utils/processAncestorData';
import axios from 'axios';
import { hashHistory } from 'react-router';
import {
    Loader, HiveView, TreeView, PlotCharacteristics,
    SingleLevel, DownloadSvg, CubeView, GeneSearch, SaveModal
} from '../components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    configureSourceID, setLoaderState,
    setGenomicData, setALignmentList, setConfiguration
} from '../redux/actions/actions';

import { initializeSnapshot, updateSnapshot } from '@kiranbandi/snapshot';

class Dashboard extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        // get the source name based on window query params
        let { sourceID } = this.props.params;
        const { multiLevel, actions, isSnapShotAvailable } = this.props,
            { configureSourceID, setLoaderState,
                setGenomicData, setConfiguration } = actions;

        axios.get('assets/files/modded_data.csv')
            .then((response) => {

                var lines = response.data.trim().split('\n').map((d) => d.split(',').map((e) => e.replace(/(\r\n|\n|\r)/gm, "")));

                var columnNamesLines = lines.slice(0, 1)[0];

                var dataLines = lines.slice(1);

                var updatedcolumnNamesLines = [...columnNamesLines, 'choice_count', 'normalized_error_count', 'normalized_error_count_minus_one']


                var updatedData = _.map(dataLines, (d) => {

                    var choice_count = studyQuestions[d[10] + '-' + d[11]][+d[12] - 1].choices.length;

                    var normalized_error_count = +d[14] / choice_count;
                    var normalized_error_count_minus_one = +d[14] / (choice_count - 1);

                    return [...d, choice_count, roundToTwoDecimal(normalized_error_count), roundToTwoDecimal(normalized_error_count_minus_one)];
                });

                saveCSV(updatedcolumnNamesLines, updatedData);

            })


        var studyQuestions = {

            'A-sample': [{
                "questionType": "existence",
                "label": "Is there a link from Country A to Country B?",
                "choices": ["Yes", "No"],
                "answer": 'Yes'
            }, {
                "questionType": "find-element",
                "label": "Which country is the end of the largest link starting at Country A?",
                "choices": ["Country A", "Country B", "Country C", "Country D"],
                "answer": "Country D"
            }, {
                "questionType": "compare-magnitude",
                "label": "Which link is larger: Country A to Country B, or Country D to Country A?",
                "choices": ["Country A to Country B", "Country D to Country A"],
                "answer": "Country A to Country B"
            }, {
                "questionType": "min-max",
                "label": "What country exports the largest total amount (including all destinations)?",
                "choices": ["Country A", "Country B", "Country C", "Country D"],
                "answer": "Country A"
            }, {
                "questionType": "count-links",
                "label": "How many countries does Country C export to?",
                "choices": ["1", "2", "3", "4", "5"],
                "answer": "3"
            }],

            'A-immigration': [{
                "questionType": "existence",
                "label": "Is there a link from East Asia to South Asia?",
                "choices": ["Yes", "No"],
                "answer": 'No'
            }, {
                "questionType": "find-element",
                "label": "Which region has the largest link going to Europe (including Europe)?",
                "choices": ['Africa', 'East Asia', 'Europe', 'Latin America', 'North America', 'Oceania', 'South Asia', 'South East Asia', 'Soviet Union', 'West Asia'],
                "answer": "Europe"
            }, {
                "questionType": "compare-magnitude",
                "label": "Which link is larger: Africa to Europe, or South Asia to North America?",
                "choices": ["Africa to Europe", "South Asia to North America"],
                "answer": "Africa to Europe"
            }, {
                "questionType": "min-max",
                "label": "What region receives the largest total number of immigrants?",
                "choices": ['Africa', 'East Asia', 'Europe', 'Latin America', 'North America', 'Oceania', 'South Asia', 'South East Asia', 'Soviet Union', 'West Asia'],
                "answer": "Europe"
            }, {
                "questionType": "count-links",
                "label": "How many links go to South East Asia?",
                "choices": ["1", "2", "3", "4", "5"],
                "answer": "2"
            }],

            'A-phone': [{
                "questionType": "existence",
                "label": "Does the chart show any users switching from Samsung to HTC?",
                "choices": ["Yes", "No"],
                "answer": 'Yes'
            }, {
                "questionType": "find-element",
                "label": "What brand had the largest number switch to Nokia (not counting Nokia itself)?",
                "choices": ['Apple', 'HTC', 'Huawei', 'LG', 'Samsung', 'Sony', 'Other'],
                "answer": "Other"
            }, {
                "questionType": "compare-magnitude",
                "label": "Do more Nokia users switch to Samsung or Other?",
                "choices": ["Samsung", "Other"],
                "answer": "Samsung"
            }, {
                "questionType": "min-max",
                "label": "Which brand had the largest number of users before the switch?",
                "choices": ['Apple', 'HTC', 'Huawei', 'LG', 'Nokia', 'Samsung', 'Sony', 'Other'],
                "answer": "Samsung"
            }, {
                "questionType": "count-links",
                "label": "How many different brands had users who switched to Sony? (not counting people who stayed with Sony)",
                "choices": ["0", "1", "2", "3", "4", "5", "6", "7", "8"],
                "answer": "6"
            }],

            'A-debt': [{
                "questionType": "existence",
                "label": "Does Greece owe money to Portugal?",
                "choices": ["Yes", "No"],
                "answer": 'Yes'
            }, {
                "questionType": "find-element",
                "label": "What is the largest link starting at the United States?",
                "choices": ['France', 'Britain', 'Greece', 'Italy', 'Portugal', 'USA', 'Germany', 'Ireland', 'Japan', 'Spain'],
                "answer": "Japan"
            }, {
                "questionType": "compare-magnitude",
                "label": "Which link is larger: Greece to France, or Germany to Italy?",
                "choices": ["Greece to France", "Germany to Italy"],
                "answer": "Germany to Italy"
            }, {
                "questionType": "min-max",
                "label": "Which two countries does Britain owe the most to?",
                "choices": ["Germany and Ireland", "Germany and Japan", "Spain and France", "Spain and Germany", "Spain and Japan"],
                "answer": "Spain and Germany"
            }, {
                "questionType": "count-links",
                "label": "How many countries does Germany owe money to?",
                "choices": ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
                "answer": "3"
            }],

            'A-space': [{
                "questionType": "existence",
                "label": "Does funder RRE Ventures invest in company Analytical Space?",
                "choices": ["Yes", "No"],
                "answer": 'No'
            }, {
                "questionType": "find-element",
                "label": "What company has both SpaceAngels and FoundersFund as investors?",
                "choices": ['Accion Systems', 'Analytical Space', 'Isotropic Systems', 'Leo Labs', 'Made in Space', 'Planet', 'SpaceX', 'Akash Systems', 'Lynk'],
                "answer": "SpaceX"
            }, {
                "questionType": "compare-magnitude",
                "label": "Which company has more investors: Analytical Space or Akash Systems?",
                "choices": ["Analytical Space", "Akash Systems"],
                "answer": "Akash Systems"
            }, {
                "questionType": "min-max",
                "label": "Which funder has invested in the most companies?",
                "choices": ['Space Angels', 'Hempisphere Ventures', 'DCVC', 'RRE Ventures', 'Lux Capital', 'Marcbell', 'Founders Fund'],
                "answer": "Space Angels"
            }, {
                "questionType": "count-links",
                "label": "How many companies has funder Marcbell invested in?",
                "choices": ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
                "answer": "3"
            }],

            'B-sample': [{
                "questionType": "existence",
                "label": "Is there a link from Country D to Country A?",
                "choices": ["Yes", "No"],
                "answer": 'Yes'
            }, {
                "questionType": "find-element",
                "label": "Which country is the starting point for the largest link ending at Country A?",
                "choices": ["Country A", "Country B", "Country C", "Country D"],
                "answer": "Country C"
            }, {
                "questionType": "compare-magnitude",
                "label": "Which link is larger: Country B to Country C, or Country D to Country B?",
                "choices": ["Country B to Country C", "Country D to Country B"],
                "answer": "Country D to Country B"
            }, {
                "questionType": "min-max",
                "label": "What country receives the smallest total amount (including all sources)?",
                "choices": ["Country A", "Country B", "Country C", "Country D"],
                "answer": "Country C"
            }, {
                "questionType": "count-links",
                "label": "How many countries does Country B receive goods from?",
                "choices": ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
                "answer": "3"
            }],

            'B-immigration': [{
                "questionType": "existence",
                "label": "Is there a link from Africa to East Asia?",
                "choices": ["Yes", "No"],
                "answer": 'No'
            }, {
                "questionType": "find-element",
                "label": "Which region has the largest link going to North America?",
                "choices": ['Africa', 'East Asia', 'Europe', 'Latin America', 'North America', 'Oceania', 'South Asia', 'South East Asia', 'Soviet Union', 'West Asia'],
                "answer": "Latin America"
            }, {
                "questionType": "compare-magnitude",
                "label": "Which link is larger: South East Asia to North America, or Latin America to Europe?",
                "choices": ["South East Asia to North America", "Latin America to Europe"],
                "answer": "Latin America to Europe"
            }, {
                "questionType": "min-max",
                "label": "Which region has the largest link going to West Asia?",
                "choices": ['Africa', 'East Asia', 'Europe', 'Latin America', 'North America', 'Oceania', 'South Asia', 'South East Asia', 'Soviet Union', 'West Asia'],
                "answer": "South Asia"
            }, {
                "questionType": "count-links",
                "label": "How many links go to West Asia?",
                "choices": ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
                "answer": "4"
            }],

            'B-phone': [{
                "questionType": "existence",
                "label": "Does the chart show any users switching from Other to LG?",
                "choices": ["Yes", "No"],
                "answer": 'Yes'
            }, {
                "questionType": "find-element",
                "label": "For previous Sony users who switched brands (not counting Sony itself), what did the largest group switch to?",
                "choices": ['Apple', 'HTC', 'Huawei', 'LG', 'Nokia', 'Samsung', 'Other'],
                "answer": "Samsung"
            }, {
                "questionType": "compare-magnitude",
                "label": "Do more users switch from Samsung to Sony, or from Apple to HTC?",
                "choices": ["Samsung to Sony", "Apple to HTC"],
                "answer": "Samsung to Sony"
            }, {
                "questionType": "min-max",
                "label": "Which brand has more total users after the switch: HTC or Huawei?",
                "choices": ['HTC', 'Huawei'],
                "answer": "HTC"
            }, {
                "questionType": "count-links",
                "label": "How many different brands had users who switched to Samsung? (not counting people who stayed with Samsung)",
                "choices": ["0", "1", "2", "3", "4", "5", "6", "7", "8"],
                "answer": "6"
            }],

            'B-debt': [{
                "questionType": "existence",
                "label": "Does Germany owe money to Italy?",
                "choices": ["Yes", "No"],
                "answer": 'Yes'
            }, {
                "questionType": "find-element",
                "label": "Which country owes the most to France?",
                "choices": ['France', 'Britain', 'Greece', 'Italy', 'Portugal', 'USA', 'Germany', 'Ireland', 'Japan', 'Spain'],
                "answer": "Italy"
            }, {
                "questionType": "compare-magnitude",
                "label": "Which is larger: the total links going outward from Ireland, or the total links coming in to Ireland?",
                "choices": ["Out from Ireland", "In to Ireland"],
                "answer": "Out from Ireland"
            }, {
                "questionType": "min-max",
                "label": "Which country does Spain owe the most to?",
                "choices": ['France', 'Britain', 'Greece', 'Italy', 'Portugal', 'USA', 'Germany', 'Ireland', 'Japan', 'Spain'],
                "answer": "France"
            }, {
                "questionType": "count-links",
                "label": "How many countries does France owe money to?",
                "choices": ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
                "answer": "1"
            }],

            'B-space': [{
                "questionType": "existence",
                "label": "Does funder Founders Fund invest in company Leo Labs?",
                "choices": ["Yes", "No"],
                "answer": 'No'
            }, {
                "questionType": "find-element",
                "label": "What company has both Hemisphere Ventures and RRE Ventures as investors?",
                "choices": ['Accion Systems', 'Analytical Space', 'Isotropic Systems', 'Leo Labs', 'Made in Space', 'Planet', 'SpaceX', 'Akash Systems', 'Lynk'],
                "answer": "Lynk"
            }, {
                "questionType": "compare-magnitude",
                "label": "Which company has more investors: Isotropic Systems or Leo Labs?",
                "choices": ["Isotropic Systems", "Leo Labs"],
                "answer": "Leo Labs"
            }, {
                "questionType": "min-max",
                "label": "Which company has the most funders?",
                "choices": ['Accion Systems', 'Analytical Space', 'Isotropic Systems', 'Leo Labs', 'Made in Space', 'Planet', 'SpaceX', 'Akash Systems', 'Lynk'],
                "answer": "Planet"
            }, {
                "questionType": "count-links",
                "label": "How many funders have invested in Made In Space?",
                "choices": ["0", "1", "2", "3", "4", "5", "6", "7"],
                "answer": "2"
            }]
        };




        // attach snapshot to the dashboard
        if (isSnapShotAvailable) {
            // isAutomaticMode ON or OFF, automatic Timer Interval
            initializeSnapshot(true, 1000,
                // Thumbnail Options
                {
                    'class': '.snapshot-thumbnail',
                    'type': 'svg',
                    'size': { 'width': 235, 'height': 100 }
                },
                // Callback function called when a snapshot is recalled
                (data) => { setConfiguration(data) });
        }

        if (sourceID == 'ancestor-source') {
            // Turn on loader
            setLoaderState(true);
            axios.get('assets/files/ancestor.bed')
                // process the ancestor bed file 
                .then((response) => processAncestorData(response.data))
                .then((data) => {
                    configureSourceID(sourceID, true);
                    setGenomicData(data);
                }).finally(() => {
                    // Turn off the loader
                    setLoaderState(false);
                });
        }

        else if (sourceID != 'uploaded-source') {
            // Turn on loader
            setLoaderState(true);
            if (!sourceID) {
                // If sourceID is not set then fetch default that is set in the initial state of the application
                hashHistory.push('dashboard/' + this.props.sourceID);
                sourceID = this.props.sourceID;
            }
            else {
                // update the sourceID set in the state with the new sourceID
                configureSourceID(sourceID, multiLevel);
            }
            getGenomicsData(sourceID).then((data) => {
                // set the genomic data
                setGenomicData(data);
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
        let { loaderState, configuration, genome = {},
            isModalVisible, multiLevel, isSnapShotAvailable,
            multiLevelType, plotType } = this.props;

        // transfer the colormap from genome to configuration
        configuration['colorMap'] = genome.colorMap || {};

        // update snapshot
        if (isSnapShotAvailable) {
            updateSnapshot(configuration);
        }

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




import _ from 'lodash';
import FileSaver from 'file-saver';

function saveCSV(columnNames = ['Date', 'Resident Name', 'EPA', 'Observer Name', 'Observer Type', 'Rating', 'Type', 'Situation Context', 'Feedback', 'Professionalism Safety', 'EPA Expired'], data) {
    // Escaping strings in quotes to evade fuckery because of
    // commas within the strings that can cause the csv file 
    // format to be changed
    var convertedData = _.map(data, (dataPoint) => {
        return dataPoint.join(',');
    });

    // Add file headers to top of the file
    convertedData.unshift(columnNames);
    var blob = new Blob([convertedData.join("\n")], { type: "text/csv;charset=utf-8" });
    FileSaver.saveAs(blob, "modded-data-updated.csv");
}



function roundToTwoDecimal(d) {
    return Math.round((d * 100)) / 100;
}