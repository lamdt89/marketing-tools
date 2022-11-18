import { CampaignModel } from '../base/CampaignModel'
import { jsonParse } from '../utils/helpers'

export class CampaignBanner extends CampaignModel {
    type = 'campaign_banner'

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
    }
}
