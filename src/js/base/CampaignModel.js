import worker from '../utils/ServiceWorker'
import { Page } from '../models/Page'
import routes from '../configurations/routes'
import { isTesting } from '../utils/helpers'

const DeviceTypes = {
    1: 'PC',
    2: 'mobile',
    3: 'all',
    4: 'M_PC',
    5: 'L_PC'
}

const IsBlank = {
    0: false,
    1: true
}

const ClickTypeParams = {
    campaign_banner: 1,
    campaign_tag: 2,
    campaign_popup: 3,
    campaign_float_banner: 4,
    box_html: 5
}

export class CampaignModel {
    type = ''
    clickThreshold = 200
    clickTimeout = null

    constructor(data) {
        this._id = data.id
        if (data.image) this.imageUrl = data.image
        if (data.link) this.link = data.link
        if (data.isBlank) this.isBlank = IsBlank[data.isBlank]

        // convert to Page object
        this.page = new Page(data?.page || [])

        // parse json to array
        const excludeUrlsObj = JSON.parse(data.excludeUrls)
        this.excludeUrls = excludeUrlsObj ? excludeUrlsObj : []
        this.activeExclude = data.hasExcludeUrls

        if (data.maxHeight) this.maxHeight = data.maxHeight
        if (data.maxWidth) this.maxWidth = data.maxWidth
        if (data.startTime) this.startTime = data.startTime
        if (data.endTime) this.endTime = data.endTime
        if (data.deviceApply) this.deviceApply = DeviceTypes[data.deviceApply]
    }

    /***
     * Using WEB-Worker for recognizing user's click in background.
     * Handle multi click at the same time.
     */
    onClick() {
        clearTimeout(this.clickTimeout)
        this.clickTimeout = setTimeout(() => {
            if (isTesting()) {
                return
            }
            let bannerId = this._id
            let href = this.link
            let userId = localStorage.getItem('user_id')
            let deviceId = this.getCookie('device_id_in_server')
            this.addEventGtm('banner_click', {
                user_id: userId,
                device_id: deviceId,
                banner_id: bannerId,
                href: href
            })
        }, this.clickThreshold)
    }

    getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    addEventGtm(eventName = "", data = {}) {
        window &&
        window.dataLayer &&
        window.dataLayer.push({
            event: eventName,
            ...data,
        });
    }

    isExcludedInCurrentUrl() {
        const currentUrl = window.location.href
        if (this.activeExclude) {
            return this.excludeUrls.includes(currentUrl)
        } else {
            return false
        }
    }

    isWorkingWithCurrentUrl() {
        let boolPage = this.page.isWorkingWithCurrentUrl()
        const isExcluded = this.isExcludedInCurrentUrl()

        return !isExcluded && boolPage
    }
}
