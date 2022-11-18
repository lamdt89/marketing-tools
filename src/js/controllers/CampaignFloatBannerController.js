import { CampaignFloatBanner } from '../models/CampaignFloatBanner'
import routes from '../configurations/routes'
import { CampaignFloatBannerRenderer } from '../renderers/CampaignFloatBannerRenderer'
import { CampaignBannerController } from './CampaignBannerController'

export class CampaignFloatBannerController extends CampaignBannerController {
    fetchUrl = routes.fetchCampaignFloatBannerUrl
    renderer = new CampaignFloatBannerRenderer()
    ModelClass = CampaignFloatBanner
}
