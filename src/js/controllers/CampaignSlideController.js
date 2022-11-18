import { CampaignController } from '../base/CampaignController'
import { CampaignSlideRenderer } from '../renderers/CampaignSlideRenderer'
import { CampaignSlide } from '../models/CampaignSlide'
import routes from '../configurations/routes'

export class CampaignSlideController extends CampaignController {
    fetchUrl = routes.fetchCampaignSlideUrl
    renderer = new CampaignSlideRenderer()
    ModelClass = CampaignSlide
}
