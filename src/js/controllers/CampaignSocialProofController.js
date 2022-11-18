import routes from '../configurations/routes'
import REST from '../utils/REST'
import {CampaignSocialProof} from "../models/CampaignSocialProof";
import { CampaignSocialProofRenderer } from '../renderers/CampaignSocialProofRenderer'
import {CampaignController} from "../base/CampaignController";


export class CampaignSocialProofController extends CampaignController {
    fetchUrl = routes.fetchSocialProofUrl
    renderer = new CampaignSocialProofRenderer()
    ModelClass = CampaignSocialProof
    ShortCodeDict = {}

    populateShortCodeData(shortCodes) {
        let array = [];
        let uniqueItems = [...new Set(shortCodes)];

        uniqueItems.forEach(shortCode => {
            array.push(this.fetchShortCodeFromServer(shortCode));
        });

        return Promise.all(array).then(raws => {
            for (let i = 0; i < raws.length; i++) {
                this.ShortCodeDict[uniqueItems[i]] = raws[i];
            }
        });
        // return new Promise((resolve, reject) => {
        //     Promise.all(array).then(raws => {
        //         localStorage.setItem('lastReceivedProof', new Date().toISOString().slice(0, 19))
        //         for (let i = 0; i < raws.length; i++) {
        //             if (raws[i].length > 0) {
        //                 this.ShortCodeDict[uniqueItems[i]] = raws[i];
        //                 DB.save('short_code', {name: uniqueItems[i], data: raws[i]}).then(() => {
        //                     resolve();
        //                 })
        //             } else {
        //                 DB.get('short_code', uniqueItems[i]).then(shortCode => {
        //                     this.ShortCodeDict[uniqueItems[i]] = shortCode.data;
        //                 });
        //             }
        //         }
        //     })
        // })
    }

    fetchShortCodeFromServer(shortCode) {
        // let last = localStorage.getItem('lastReceivedProof');
        // if (!last) {
        //     last = "2021-02-22T17:00:00"
        // }
        let last = "2021-02-22T17:00:00";
        const domain = window.location.hostname;
        return REST.GET(routes.fetchSocialProofDataUrl, {
            shortCode: shortCode,
            lastReceivedTime: last,
            domain: domain
        });
    }

    getAllShortCodeFromModel() {
        return this.models.flatMap(model => {
            return model.getShortCodesFromRawMessage();
        });
    }

    populateData() {
        return new Promise((resolve, reject) => {
            if (this.models.length <= 0) {
                this.fetchDataModel()
                    .then(data => {
                        this.setDataModel(data);
                        let shortCodes = this.getAllShortCodeFromModel();
                        this.populateShortCodeData(shortCodes).then(() => {
                            this.models.forEach(model => {
                                model.ShortCodeDict = this.ShortCodeDict;
                            });
                            resolve(this.models);
                        })
                    })
                    .catch(err => {
                        reject(err)
                    })
            } else {
                resolve(this.models)
            }
        })
    }
}
