import { CampaignBannerRenderer } from './CampaignBannerRenderer'
import { JTravel } from '../utils/JTravel'

export class CampaignFloatBannerRenderer extends CampaignBannerRenderer {
    wrapClass = 'JTravel-Float-Banner'

    registerBaseCss() {
        super.registerBaseCss()
    }

    fixPosition(model, contentHtml) {
        contentHtml.style.zIndex = model.zIndex ? model.zIndex : 9999
        contentHtml.style.position = 'fixed'
        if (model.positionType === 'top_right') {
            contentHtml.style.top = '0'
            contentHtml.style.right = '0'
        } else if (model.positionType === 'top_left') {
            contentHtml.style.top = '0'
            contentHtml.style.left = '0'
        } else if (model.positionType === 'bottom_right') {
            contentHtml.style.bottom = '0'
            contentHtml.style.right = '0'
        } else if (model.positionType === 'bottom_left') {
            contentHtml.style.bottom = '0'
            contentHtml.style.left = '0'
        } else if (model.positionType === 'middle_right') {
            contentHtml.style.top = '50%'
            contentHtml.style.transform = 'translateY(-50%)'
            contentHtml.style.right = '0'
        } else if (model.positionType === 'middle_left') {
            contentHtml.style.top = '50%'
            contentHtml.style.transform = 'translateY(-50%)'
            contentHtml.style.left = '0'
        }
    }

    /**
     *
     * @param model
     * @returns {HTMLElement}
     */
    populateContent(model) {
        const contentHtml = super.populateContent(model)
        if (model?.bannerStyle)
            contentHtml.style.cssText = JTravel.objectToInlineCss(model.bannerStyle)
        this.fixPosition(model, contentHtml)
        return contentHtml
    }

    registerEvent(model, contentHtml) {
        super.registerEvent(model, contentHtml)
    }
}
