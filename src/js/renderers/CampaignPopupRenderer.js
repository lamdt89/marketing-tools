import { CampaignRenderer } from '../base/CampaignRenderer'
import {JTravel} from "../utils/JTravel";

export class CampaignPopupRenderer extends CampaignRenderer {
    wrapClass = 'JTravel-Popup'
    cssRule = {
        '.jtravel-modal': {
            position: 'fixed',
            display: 'flex',
            'flex-flow': 'column',
            'justify-content': 'center',
            'z-index': 9999999999,
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            overflow: 'auto',
            'background-color': 'rgba(0,0,0,0.4)'
        },
        '.jtravel-modal-content': {
            margin: 'auto',
            position: 'relative',
            '-webkit-animation-name': 'jtravel_animate_top',
            '-webkit-animation-duration': '0.4s',
            'animation-name': 'jtravel_animate_top',
            'animation-duration': '0.4s',
        },
        '.jtravel-close': {
            position: 'absolute',
            color: '#6e6e6e',
            right: 0,
            'font-size': '28px',
            'font-weight': 'bold',
            'line-height': '18px'
        },
        '.jtravel-close:hover,.jtravel-close:focus': {
            color: '#000',
            'text-decoration': 'none',
            cursor: 'pointer'
        },
        _:
            '@-webkit-keyframes jtravel_animate_top {' +
            '  from {top:-300px; opacity:0}' +
            '  to {top:0; opacity:1}' +
            '}' +
            '@keyframes jtravel_animate_top {' +
            '  from {top:-300px; opacity:0}' +
            '  to {top:0; opacity:1}' +
            '}'
    }

    delay = 200

    /**
     *
     * @param model
     * @returns {HTMLElement}
     */
    populateContent(model) {
        const a = this.createLink(model)
        const popupContainer = document.createElement('div')
        popupContainer.setAttribute('class', 'jtravel-modal')

        const popupContent = document.createElement('div')
        popupContent.setAttribute('class', 'jtravel-modal-content')

        const closeIcon = document.createElement('span')
        closeIcon.setAttribute('class', 'jtravel-close')
        closeIcon.innerHTML = '&times;'

        if (model.closeButtonStyle) {
            try {
                let closeButtonStyle = JSON.parse(model.closeButtonStyle)
                closeIcon.style.cssText = JTravel.objectToInlineCss(closeButtonStyle)
            } catch (e) {
                throw e
            }
        }

        popupContent.appendChild(closeIcon)
        popupContent.appendChild(a)
        popupContainer.appendChild(popupContent)
        popupContainer.setAttribute('id', model._id)

        return popupContainer
    }

    registerEvent(model, contentHtml) {
        // click campaign
        const popup = contentHtml.getElementsByClassName('jtravel-modal-content')[0]
        super.registerEvent(model, popup)
        // close popup
        const closeIcon = contentHtml.getElementsByClassName('jtravel-close')[0]
        closeIcon.onclick = function(ev) {
            ev.stopPropagation()
            contentHtml.style.display = 'none'
        }
        // close when user click outside of popup
        if (model.closeOnClick) {
            contentHtml.onclick = function(event) {
                contentHtml.style.display = 'none';
            }
        }
    }

    render(model) {
        let lastRendered = localStorage.getItem('last_' + model._id)
        if (!lastRendered) {
            localStorage.setItem('last_' + model._id, new Date().toString())
            localStorage.setItem('first_' + model._id, new Date().toString())
            localStorage.setItem('count_' + model._id, '1')
            return super.render(model)
        }

        lastRendered = new Date(lastRendered)

        let count = parseInt(localStorage.getItem('count_' + model._id))
        let firstRendered = new Date(localStorage.getItem('first_' + model._id))
        let threshold = model.displayInterval/model.displayTimes

        if (model.displayIntervalUnit === 'h') {
            lastRendered = new Date(lastRendered.getTime() + threshold*60*60000)
            firstRendered = new Date(firstRendered.getTime() + model.displayInterval*60*60000)
        } else {
            lastRendered = new Date(lastRendered.getTime() + threshold*24*60*60000)
            firstRendered = new Date(firstRendered.getTime() + model.displayInterval*24*60*60000)
        }

        if (count < model.displayTimes && new Date() >= lastRendered) {
            count += 1
            localStorage.setItem('count_' + model._id, count.toString())
            localStorage.setItem('last_' + model._id, new Date().toString())
            return super.render(model)
        } else if (new Date() >= firstRendered) {
            localStorage.setItem('count_' + model._id, '1')
            localStorage.setItem('last_' + model._id, new Date().toString())
            localStorage.setItem('first_' + model._id, new Date().toString())
            return super.render(model)
        }
    }

}
