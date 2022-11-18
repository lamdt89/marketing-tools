import { CampaignController } from '../base/CampaignController'
import { CampaignBannerRenderer } from '../renderers/CampaignBannerRenderer'
import { CampaignBanner } from '../models/CampaignBanner'
import routes from '../configurations/routes'

export class CampaignBannerController extends CampaignController {
    fetchUrl = routes.fetchCampaignBannerUrl
    renderer = new CampaignBannerRenderer()
    ModelClass = CampaignBanner
}
