import { CampaignBanner } from './CampaignBanner'

export class CampaignFloatBanner extends CampaignBanner {
    type = 'campaign_float_banner'

    constructor(data) {
        super(data)
        this.positionType = data.positionType
        this.zIndex = data.zindex
    }
}
