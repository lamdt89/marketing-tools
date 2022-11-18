import { CampaignRenderer } from '../base/CampaignRenderer'
import { initializeClock } from '../utils/helpers'
import { JTravel } from '../utils/JTravel'

export class CampaignBannerRenderer extends CampaignRenderer {
    wrapClass = 'JTravel-Banner'
    cssRule = {
        'JTravel-Banner': {
            clear: 'both'
        },
        '.jtravel-banner-container': {
            display: 'flex',
            'flex-flow': 'column wrap',
            'justify-content': 'center'
        },
        '.jtravel-count-down': {
            position: 'absolute',
            'font-weight': 'bold',
            'font-size': '32px',
            color: 'white',
            'margin-left': '60%',
            display: 'flex',
            'flex-flow': 'row',
            'justify-content': 'space-between'
        },
        '.clock-div-container': {
            display: 'flex',
            'flex-flow': 'column'
        },
        '.clock-div-value': {
            'text-align': 'center'
        },
        '.clock-div-label': {
            'text-align': 'center',
            'margin-top': '8px'
        }
    }

    registerBaseCss() {
        if (JTravel.isMobile()) {
            this.cssRule['.clock-div-label']['margin-top'] = '4px'
        }
        super.registerBaseCss()
    }

    /**
     *
     * @param model
     * @returns {HTMLElement}
     */
    populateContent(model) {
        const a = super.populateContent(model)
        a.setAttribute('class', 'jtravel-banner-container')
        if (model.bannerStyle) a.style.cssText = JTravel.objectToInlineCss(model.bannerStyle)
        if (model.showCountDown) {
            const countDown = document.createElement('div')
            countDown.setAttribute('id', 'cd_' + model._id)
            countDown.setAttribute('class', 'jtravel-count-down')
            a.appendChild(countDown)
            initializeClock(countDown, model.endTime, model.cdTimeStyle, model.cdLabelStyle)

            if (model.cdMarginLeft) {
                countDown.style.cssText = JTravel.objectToInlineCss({
                    'margin-left': model.cdMarginLeft
                })
            }
        }
        return a
    }

    registerEvent(model, contentHtml) {
        super.registerEvent(model, contentHtml)
    }
}
