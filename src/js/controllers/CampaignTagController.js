import { CampaignController } from '../base/CampaignController'
import { CampaignTagRenderer } from '../renderers/CampaignTagRenderer'
import { CampaignTag } from '../models/CampaignTag'
import routes from '../configurations/routes'

export class CampaignTagController extends CampaignController {
    fetchUrl = routes.fetchCampaignTagUrl
    renderer = new CampaignTagRenderer()
    ModelClass = CampaignTag
}
