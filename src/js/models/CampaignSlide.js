import { CampaignModel } from '../base/CampaignModel'
import { jsonParse } from '../utils/helpers'

export class CampaignSlide extends CampaignModel {
    type = 'campaign_slide'

    constructor(data) {
        super(data)
        if (data.showCountDown) {
            this.showCountDown = data.showCountDown
            const countDownStyle = jsonParse(data.countDownStyle)
            const marginLeft = countDownStyle['margin-left']
            delete countDownStyle['margin-left']
            this.cdMarginLeft = marginLeft
            this.cdTimeStyle = countDownStyle
            this.cdLabelStyle = data.labelStyle
        }

        if (data.bannerStyle) {
            const bannerStyle = jsonParse(data.bannerStyle)
            const imgStyle = {
                width: bannerStyle['width'] || '100%',
                height: bannerStyle['height'] || 'auto'
            }
            delete bannerStyle['width']
            delete bannerStyle['height']
            this.bannerStyle = bannerStyle
            this.imgStyle = imgStyle
        }
        this.actionBtnStyle = data.actionBtnStyle
        this.autoDuration = data.autoDuration
        this.autoStatus = data.autoStatus
        this.indicatorBtnStyle = data.indicatorBtnStyle
        this.slideBannerItems = data.slideBannerItems
        this.totalBannerLblStyle = data.totalBannerLblStyle
    }
}
