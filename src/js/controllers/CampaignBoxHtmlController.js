import { CampaignBoxHtml } from '../models/CampaignBoxHtml'
import routes from '../configurations/routes'
import { CampaignBoxHtmlRenderer } from '../renderers/CampaignBoxHtmlRenderer'
import { CampaignBannerController } from './CampaignBannerController'
import REST from '../utils/REST'
import config from '../configurations/config'
import get from 'lodash/get'

export class CampaignBoxHtmlController extends CampaignBannerController {
    fetchUrl = routes.fetchBoxHtmlUrl
    renderer = new CampaignBoxHtmlRenderer()
    ModelClass = CampaignBoxHtml
    partnerData = {}

    populatePartnerData(partnerId) {
        return new Promise((resolve, reject) => {
            this.fetchPartnerDataFromServer(partnerId)
                .then(response => {
                    const res = response?.data || []
                    const rootKey = response?.rootKey || ''
                    const dataParse = JSON.parse(res)
                    let data = []
                    if (rootKey && dataParse) data = get(dataParse, rootKey)
                    this.partnerData = data
                    resolve(this.partnerData)
                })
                .catch(err => {
                    reject(err)
                })
        })
    }

    fetchPartnerDataFromServer(partnerId) {
        const lastTime = new Date().toISOString().slice(0, 19)
        return REST.GET(routes.fetchBoxHtmlDataUrl, {
            partnerId,
            lastReceivedTime: lastTime
        })
    }

    populateData() {
        return new Promise((resolve, reject) => {
            if (this.models.length <= 0) {
                this.fetchDataModel()
                    .then(data => {
                        this.setDataModel(data)
                        this.models.forEach(model => {
                            if (model.boxType === config.BOX_TYPE.PARTNER)
                                this.populatePartnerData(model.partnerId).then(() => {
                                    model.partnerData = this.partnerData
                                })
                        })
                        resolve(this.models)
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
