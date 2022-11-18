import { CampaignModel } from '../base/CampaignModel'

export class CampaignTag extends CampaignModel {
    type = 'campaign_tag'

    constructor(data) {
        super(data)
        this.text = data.text
        this.textColor = data.textColor
        this.backgroundColor = data.backgroundColor
    }
}
