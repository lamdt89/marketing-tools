import { CampaignModel } from '../base/CampaignModel'

export class CampaignPopup extends CampaignModel {
    type = 'campaign_popup'

    constructor(data) {
        super(data)
        this.closeButtonStyle = data.closeButtonStyle
        this.closeOnClick = data.closeOnClick
        this.displayTimes = data.displayTimes
        this.displayInterval = data.displayInterval
        this.displayIntervalUnit = data.displayIntervalUnit
    }
}
