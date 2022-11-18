import { CampaignBannerRenderer } from './CampaignBannerRenderer'
import config from '../configurations/config'
import { JTravel } from '../utils/JTravel'

export class CampaignBoxHtmlRenderer extends CampaignBannerRenderer {
    wrapClass = 'JTravel-Box-Html'
    // cssRule = {
    //     body: {
    //         height: '2000px'
    //     }
    // }

    buildingSelector(model) {
        if (model?.floatDisplayType && model.floatDisplayType) {
            model.insertType = 'append'
            return 'body'
        } else {
            return super.buildingSelector(model)
        }
    }

    registerBaseCss() {
        super.registerBaseCss()
    }

    _renderBoxHtmlStaticData(model, contentHtml) {
        contentHtml.setAttribute('class', 'jtravel-box-html-container')
        contentHtml.innerHTML = JSON.parse(model.contentHtml)?.html || ''
    }

    _renderBoxHtmlApiPartnerData(model, contentHtml) {
        contentHtml.setAttribute('class', 'jtravel-box-html-container')
        const html = model.getBoxHtml()
        if (html) contentHtml.innerHTML = JSON.parse(html)?.html || ''
    }

    fixPosition(model, contentHtml) {
        // const elmt = document.getElementsByClassName('jtravel-box-html-container')
        setTimeout(() => {
            contentHtml.style.zIndex = model.zIndex ? model.zIndex : 9999
            // const screenHeight = screen.height
            contentHtml.style = JTravel.objectToInlineCss({
                width: 'fit-content',
                height: 'fit-content',
                position: 'fixed'
            })
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
                contentHtml.style.right = '0'
                contentHtml.style.top = '50%'
                contentHtml.style.transform = 'translateY(-50%)'
                // if (elmt[0] && elmt[0].offsetHeight && screenHeight) {
                //     contentHtml.style.top = `${(screenHeight - elmt[0].offsetHeight) / 2}px`
                // }
            } else if (model.positionType === 'middle_left') {
                contentHtml.style.left = '0'
                contentHtml.style.top = '50%'
                contentHtml.style.transform = 'translateY(-50%)'
                // if (elmt[0] && elmt[0].offsetHeight && screenHeight) {
                //     contentHtml.style.top = `${(screenHeight - elmt[0].offsetHeight) / 2}px`
                // }
            }
        }, 100)
    }

    /**
     *
     * @param model
     * @returns {HTMLElement}
     */
    populateContent(model) {
        const contentHtml = document.createElement('div')
        switch (model.boxType) {
            case config.BOX_TYPE.STATIC:
                this._renderBoxHtmlStaticData(model, contentHtml)
                break

            case config.BOX_TYPE.PARTNER:
                this._renderBoxHtmlApiPartnerData(model, contentHtml)
                break

            default:
                break
        }

        if (model.floatDisplayType) {
            this.fixPosition(model, contentHtml)
        }

        const _contentHtml = model.contentHtml ? JSON.parse(model.contentHtml) : ''
        if (_contentHtml?.js) {
            const script = document.createElement('script')
            script.type = 'text/javascript'
            script.innerHTML = _contentHtml.js
            contentHtml.appendChild(script)
        }

        return contentHtml
    }

    registerEvent(model, contentHtml) {
        super.registerEvent(model, contentHtml)
    }
}
