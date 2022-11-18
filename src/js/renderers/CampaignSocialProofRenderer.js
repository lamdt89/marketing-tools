import { JTravel } from '../utils/JTravel'
import { CampaignRenderer } from '../base/CampaignRenderer'

export class CampaignSocialProofRenderer extends CampaignRenderer {
    wrapClass = 'JTravel-Social-Proof'
    LastDisplayCheckList = {}
    FirstRunCheckList = {}

    cssRule = {
        '.JTravel-Social-Proof': {
            opacity: '0',
            animation: 'fadeinout 2s',
            width: '100px',
            'word-wrap': 'break-word',
            'white-space': 'initial'
        },
        _:
            '@keyframes shimmy {' +
            '  0% {' +
            '    transform: translate(0, 0);' +
            '  }' +
            '  30% {' +
            '    transform: translate(0, -40px);' +
            '  }' +
            '  100% {' +
            '    transform: translate(0, -40px);' +
            '  }' +
            '}' +
            '@keyframes fadeinout {' +
            ' 0%,100% { opacity: 0;}' +
            '40% { opacity: 0.9; }' +
            '70%' +
            '{opacity: 0.9}' +
            +'}'
    }

    clearInStart() {
        return false
    }

    fixPosition(position, contentHtml) {
        if (position === 'top_right') {
            if (JTravel.isMobile()) {
                contentHtml.style.top = '2px'
                contentHtml.style.right = '2px'
            }
            {
                contentHtml.style.top = '16px'
                contentHtml.style.right = '16px'
            }
        } else if (position === 'top_left') {
            if (JTravel.isMobile()) {
                contentHtml.style.top = '2px'
                contentHtml.style.left = '2px'
            } else {
                contentHtml.style.top = '16px'
                contentHtml.style.left = '16px'
            }
        } else if (position === 'bottom_right') {
            if (JTravel.isMobile()) {
                contentHtml.style.bottom = '2px'
                contentHtml.style.right = '2px'
            } else {
                contentHtml.style.bottom = '16px'
                contentHtml.style.right = '16px'
            }
        } else if (position === 'bottom_left') {
            if (JTravel.isMobile()) {
                contentHtml.style.bottom = '2px'
                contentHtml.style.left = '2px'
            } else {
                contentHtml.style.bottom = '16px'
                contentHtml.style.left = '16px'
            }
        } else if (position === 'middle_right') {
            if (JTravel.isMobile()) {
                contentHtml.style.right = '2px'
            } else {
                contentHtml.style.right = '16px'
            }
            contentHtml.style.top = '50vh'
            contentHtml.style.bottom = '50vh'
        } else if (position === 'middle_left') {
            if (JTravel.isMobile()) {
                contentHtml.style.left = '2px'
            } else {
                contentHtml.style.left = '16px'
            }
            contentHtml.style.top = '50vh'
            contentHtml.style.bottom = '50vh'
        }
    }

    /**
     *
     * @param model
     * @returns {HTMLElement}
     */
    populateContent(model) {
        const container = document.createElement('div')
        container.className = 'social-proof-container'
        const text = document.createElement('h4')
        text.id = 'social_proof_msg'
        text.style.whiteSpace = 'initial'
        text.style.maxWidth = '100%'
        text.style.alignItems = 'center'
        text.style.background = '#d94a38'
        text.style.color = '#fff'
        text.style.boxShadow = '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)'
        text.style.zIndex = '3 !important'
        text.style.animation = 'shimmy 2s'

        if (JTravel.isMobile()) {
            container.style.maxWidth = '70%'
            text.style.padding = '8px 16px'
            text.style.borderRadius = '4px'
        } else {
            text.style.padding = '16px 32px'
            text.style.borderRadius = '8px'
            container.style.maxWidth = '30%'
        }

        container.style.position = 'fixed'
        container.style.display = 'flex'
        container.style.flexFlow = 'column'
        container.style.zIndex = '9999'
        container.style.justifyContent = 'center'

        container.appendChild(text)

        const msg = model.getDisplayingMessage()
        if (!msg) {
            container.style.display = 'none'
        } else {
            text.innerHTML = msg
        }
        if (!this.FirstRunCheckList[model._id]) {
            container.style.visibility = 'hidden'
        }
        this.fixPosition(model.position, container)

        return container
    }

    modifyParentStyle(contentHtml) {
        setTimeout(() => {
            contentHtml.remove()
        }, 2000)
    }

    setCurrentDisplayTimeFrame(model) {
        const current = new Date().toLocaleTimeString(undefined, { hour12: false })
        const frequency = model.frequency
        model.isDefaultF = true
        frequency.forEach(f => {
            if (
                this.largerOrEqual(current, f.hourStart) &&
                this.largerOrEqual(f.hourEnd, current)
            ) {
                model.currentF = f
                model.isDefaultF = false
            }
        })
    }

    largerOrEqual(t1, t2) {
        const tmp1 = t1.split(':')
        const tmp2 = t2.split(':')
        const h1 = parseInt(tmp1[0])
        const h2 = parseInt(tmp2[0])
        const m1 = parseInt(tmp1[1])
        const m2 = parseInt(tmp2[1])
        const s1 = parseInt(tmp1[2])
        const s2 = parseInt(tmp2[2])
        if (h1 > h2) {
            return true
        } else if (h1 < h2) {
            return false
        } else {
            if (m1 > m2) {
                return true
            } else if (m1 < m2) {
                return false
            } else {
                return s1 >= s2
            }
        }
    }

    checkDisplayInterval(model) {
        const default_period = 2 * 1000
        let unit, period

        this.setCurrentDisplayTimeFrame(model)

        if (model.isDefaultF) {
            period = default_period
        } else {
            if (model.currentF.unitTimes === 'second') {
                unit = 1 * 1000
            } else if (model.currentF.unitTimes === 'minute') {
                unit = 60 * 1000
            } else {
                unit = 3600 * 1000
            }
            period = unit / parseInt(model.currentF.displayTimes)
        }

        const last = this.LastDisplayCheckList[model._id]
        if (!last || new Date() - last >= period) {
            this.render(model)
            this.LastDisplayCheckList[model._id] = new Date()
        }
    }

    startSchedule(model, interval) {
        setInterval(() => {
            this.checkDisplayInterval(model)
        }, interval)
    }

    registerEvent(model, contentHtml) {
        super.registerEvent(model, contentHtml)
        if (!this.FirstRunCheckList[model._id]) {
            this.startSchedule(model, 500)
            this.FirstRunCheckList[model._id] = true
        }
    }
}
