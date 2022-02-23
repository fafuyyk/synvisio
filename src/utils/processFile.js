import gffWorker from "../workers/gff.worker";
import collinearWorker from "../workers/collinear.worker";
import linkageWorker from "../workers/linkage.worker";
import toastr from './toastr';

export default function (rawData, typeOfFile, additionalParams = {}) {
    return new Promise((resolve, reject) => {
        var instance;
        switch (typeOfFile) {
            case 'gff':
                instance = gffWorker();
                break;
            case 'collinear':
                instance = collinearWorker();
                break;
            case 'linkage':
                instance = linkageWorker();
        }
        instance.process(rawData, additionalParams).catch(() => {
            toastr["error"]("Error in parsing the " + typeOfFile + " File", "ERROR");
            reject();
            instance.terminate();
        }).then(data => {
            resolve(data);
            instance.terminate();
        })
    })
}