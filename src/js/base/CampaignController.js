import REST from '../utils/REST'
import { CampaignRenderer } from './CampaignRenderer'
import { CampaignModel } from './CampaignModel'
import { isTesting } from '../utils/helpers'

/**
 * BaseController of Campaign
 * Controller will fetch data from server, populate list objects (Model)
 * and render them by Renderer
 * @fetchUrl: REST-GET api
 * @renderer: The renderer object of campaign
 * @models: List of campaign object
 * @ModelClass: The model class of campaign
 */
export class CampaignController {
    fetchUrl = ''
    renderer = new CampaignRenderer()
    models = []
    ModelClass = CampaignModel

    constructor() {}

    /**
     * Get data from server by calling corresponding API.
     * If isTesting() = true, get all publishing and testing campaigns.
     * Else only get publishing campaigns.
     * @returns {Promise<*>}
     */
    fetchDataModel() {
        const domain = window.location.hostname
        return REST.GET(this.fetchUrl, { domain: domain, isTesting: isTesting() }, {}, {})
    }

    /**
     * Parsing data and creating corresponding Object Model.
     * A Campaign is configured to show in many pages, so we duplicate the campaign model for converting to
     * 1-1 relationship.
     * @param data
     */
    setDataModel(data) {
        if (!data) {
            return
        }
        if (!(data instanceof Array)) {
            data = [data]
        }
        data.forEach(item => {
            item.pages.forEach(page => {
                const _item = JSON.parse(JSON.stringify(item))
                _item.page = page
                this.models.push(new this.ModelClass(_item))
            })
        })
    }

    /**
     * Getting data from server and creating Object Model.
     * @returns {Promise<unknown>}
     */
    populateData() {
        return new Promise((resolve, reject) => {
            if (this.models.length <= 0) {
                this.fetchDataModel()
                    .then(data => {
                        console.log(data)
                        this.setDataModel(data)
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

    /**
     * Running Controller.
     * Getting data, creating object and rendering them by Renderer.
     */
    start() {
        this.renderer.clearInStart(document)
        this.populateData().then(models => {
            models.forEach(model => {
                this.renderer.render(model)
            })
        })
    }
}
