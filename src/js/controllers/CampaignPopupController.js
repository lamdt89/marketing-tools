import { CampaignController } from '../base/CampaignController'
import { CampaignPopupRenderer } from '../renderers/CampaignPopupRenderer'
import { CampaignPopup } from '../models/CampaignPopup'
import routes from '../configurations/routes'

export class CampaignPopupController extends CampaignController {
    fetchUrl = routes.fetchCampaignPopupUrl
    renderer = new CampaignPopupRenderer()
    ModelClass = CampaignPopup
}
