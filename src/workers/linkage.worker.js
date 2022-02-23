import _ from 'lodash';

export function process(linkageRawData) {

    let linkageList = [];

    linkageRawData.split('\n')
        .filter((d) => d.length > 0 && d.indexOf('unitig') == -1)
        .map((d) => d.trim().split('\t')).slice(1)
        .map((e) => {
            let distance = e[3].trim();
            if (distance.indexOf('na') == -1) {
                linkageList.push({
                    'locus': e[0],
                    'position': e[1],
                    'linkageID': e[2],
                    'distance': +(e[3].trim()),
                    'score': (+(e[4] ? e[4].trim() : 0)),
                    'het': (+(e[5] ? e[5].trim() : 0))
                })
            }
        });

    let newLibrary = new Map(),
        newMap = new Map();

    linkageList.forEach(function (linkage) {
        let chromosomeId = linkage.linkageID,
            speciesIdentifier = 'lg',
            geneStart = linkage.distance,
            geneEnd = linkage.distance + 0.001,
            geneId = chromosomeId + '_' + linkage.distance;

        newLibrary.set(geneId, {
            'start': geneStart,
            'end': geneEnd,
            // the first 2 characters are the genome name and can be removed
            'chromosomeId': chromosomeId
        })
        // To create a list of the start and end of all chromosomes
        if (!newMap.has(chromosomeId)) {
            newMap.set(chromosomeId, {
                start: geneStart,
                end: geneEnd,
                'speciesIdentifier': speciesIdentifier
            });
        } else {
            var entry = newMap.get(chromosomeId);
            if (geneStart < entry.start) {
                entry.start = geneStart;
            }
            if (geneEnd > entry.end) {
                entry.end = geneEnd;
            }
            newMap.set(chromosomeId, entry);
        }
    })
    // once all parsing is done set width of each chromosome
    newMap.forEach((chromosome) => {
        chromosome.width = chromosome.end - chromosome.start;
    });


    // For track data 
    // First group linkage data by linkage ID
    const trackMin = _.minBy(linkageList, (d) => d.score),
        trackMax = _.maxBy(linkageList, (d) => d.score);

    let groupedByLinkageID = _.groupBy(linkageList, (d) => d.linkageID);

    _.map(groupedByLinkageID, (linkageGroupSet, groupKey) => {
        groupedByLinkageID[groupKey] = _.map(linkageGroupSet, (e) => ({
            'value': e.score,
            'start': e.distance,
            'end': e.distance + 0.001,
        }))
    });

    const trackStore = { 'newMap': groupedByLinkageID, 'min': trackMin.score, 'max': trackMax.score };
    // // set the genomic data
    return ({ newMap, newLibrary, linkageList, 'trackData': [trackStore] });
};

