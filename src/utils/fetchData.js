/*global $ */
import axios from 'axios';
import processFile from './processFile';
import toastr from './toastr';

var fetchData = {};

fetchData.getGenomicsData = function (sourceID) {

    return new Promise((resolve, reject) => {

        var datastore = {};

        // get the coordinate file
        axios.get('assets/files/' + sourceID + '_coordinate.gff')
            // process the coordinate file 
            .then((response) => { return processFile(response.data, 'gff') })
            // get the collinear file
            .then((data) => {
                datastore = Object.assign(datastore, { ...data });
                return axios.get('assets/files/' + sourceID + '_collinear.collinearity');
            })
            // process the collinear file
            .then(((response) => {
                return processFile(response.data, 'collinear');
            }))
            // if there is an error in any of the above paths reject the promise and stop the promise chain below too
            .catch((err) => {
                toastr["error"]("Failed to fetch and parse required files for source - " + sourceID, "ERROR");
                reject();
                return Promise.reject(err);
            })
            // if everything above was successful try to load the linkage data
            .then((data) => {
                datastore = Object.assign({}, datastore, { ...data });
                console.log('Synteny data loading and processing complete...');
                return axios.get('assets/files/' + sourceID + '_linkage.txt');
            })
            // if the data is not present resolve the promise without the track data
            .then((response) => { return processFile(response.data, 'linkage') })
            .then((data) => {

                const { newMap, newLibrary, linkageList, trackData } = data,
                    { chromosomeMap, genomeLibrary } = datastore;

                datastore.chromosomeMap = new Map([...chromosomeMap, ...newMap]);
                datastore.genomeLibrary = new Map([...genomeLibrary, ...newLibrary]);

                datastore = Object.assign({}, datastore, { linkageList });
                resolve({ ...datastore, trackData });
            })
            .catch(() => { resolve({ ...datastore, trackData: [false] }); })
    });
}

module.exports = fetchData;