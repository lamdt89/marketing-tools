/**
 * Base Renderer of Campaign
 * Renderer will interact with DOM
 * @cssRule: Define style of campaign type
 * @delay: Time to render
 * @retries: Try to find destination-element N times
 * @interval: Period between two finding times
 */
import { JTravel } from '../utils/JTravel'

export class CampaignRenderer {
    cssRule = {}
    delay = 0
    retries = 16
    interval = 3000
    wrapClass = 'JTravel-VNT'

    constructor() {}

    /**
     * Clear all old campaigns when web applications change their page.
     * Because maybe HTML will not render again.
     */
    clearInStart(parent) {
        const trash = parent.getElementsByClassName(this.wrapClass)
        let i = trash.length
        while (i--) {
            trash[i].remove()
        }
    }

    /**
     * Building query selector from a page position for finding the destination of the campaign.
     * Popup and Float Banner will be appended to body.
     * @param page
     * @returns {string|string|*}
     * @private
     */
    _buildingSelectorByPage(page) {
        const pagePosition = page.pagePosition
        if (!pagePosition || page.pageType === 'popup' || page.pageType === 'float_banner') {
            return 'body'
        }
        if (pagePosition.selectorQuery) {
            return pagePosition.selectorQuery
        }
        let ref = ''
        if (pagePosition.selectorId) {
            ref = '#' + pagePosition.selectorId
        } else if (pagePosition.selectorClass) {
            ref = '.' + pagePosition.selectorClass
        }
        return ref === '' ? 'body' : ref
    }

    /**
     * Building the query selector for a campaign.
     * The campaign will be appended to destination by default.
     * @param model
     * @returns {string|*}
     */
    buildingSelector(model) {
        const page = model.page
        model.insertType = page.pagePosition
            ? page.pagePosition.insertType
                ? page.pagePosition.insertType
                : 'append'
            : 'append'
        return this._buildingSelectorByPage(page)
    }

    _findElement(selector) {
        const destHtmlNodes = document.querySelectorAll(selector)
        if (destHtmlNodes.length <= 0) {
            return false
        }
        return destHtmlNodes
    }

    findElementAsync(model) {
        return new Promise((resolve, reject) => {
            let count = 0
            const selector = this.buildingSelector(model)
            // Cover lazy loading case
            const interval = setInterval(() => {
                const destHtmlNodes = this._findElement(selector)
                if (destHtmlNodes) {
                    clearInterval(interval)
                    resolve(destHtmlNodes)
                } else if (count === this.retries) {
                    // finding in 2s
                    reject("Can't Find The Destination Element: " + model.type + '_' + model._id)
                } else {
                    count++
                }
            }, this.interval)
        })
    }

    checkRenderCondition(model) {
        return this._checkPage(model) && this._checkDevices(model)
    }

    _checkPage(model) {
        return model.isWorkingWithCurrentUrl()
    }

    _checkDevices(model) {
        if (model.deviceApply === 'all') {
            return true
        } else if (JTravel.isMobile()) {
            return model.deviceApply === 'mobile'
        } else {
            if (model.type == 'campaign_banner' || model.type == 'campaign_float_banner') {
                if (window.screen.width <= 1440) {
                    return model.deviceApply === 'PC'
                } else if (window.screen.width > 1440 && window.screen.width <= 2880) {
                    return model.deviceApply === 'M_PC'
                } else {
                    return model.deviceApply === 'L_PC'
                }
            } else {
                return model.deviceApply === 'PC'
            }
        }
    }

    /**
     * Create a stylesheet for styling campaign component
     */
    registerBaseCss() {
        // check empty object
        if (Object.keys(this.cssRule).length === 0 && this.cssRule.constructor === Object) {
            return
        }
        const styleSheet = document.createElement('style')
        styleSheet.innerText = JTravel.objectToCss(this.cssRule)
        document.head.appendChild(styleSheet)
    }

    registerEvent(model, contentHtml) {
        contentHtml.onclick = function() {
            model.onClick()
        }
    }

    /**
     * @param model
     * @returns {HTMLElement}
     */
    createLink(model) {
        const img = document.createElement('img')
        img.setAttribute('src', model.imageUrl)
        // Set default style for all images
        img.style.display = 'block'
        img.style.height = model.imgStyle?.height || 'auto'
        img.style.width = model.imgStyle?.width || '100%'

        const a = document.createElement('a')
        a.setAttribute('href', model.link)
        if (model.isBlank) {
            a.setAttribute('target', '_blank')
        }
        a.appendChild(img)
        // Set id of campaign at the parented container
        a.setAttribute('id', model._id)

        return a
    }

    /**
     * Init content for a campaign.
     * Inherit this method for creating a new campaign type.
     * @param model
     * @returns {HTMLElement}
     */
    populateContent(model) {
        return this.createLink(model)
    }

    wrapContent(contentHtml, model) {
        const div = document.createElement('div')
        div.setAttribute('class', this.wrapClass)
        div.setAttribute('id', 'wrap_' + model._id)
        div.appendChild(contentHtml)
        return div
    }

    renderContent(contentHtml, destHtml, insertType) {
        return new Promise(resolve => {
            // remove old campaign
            this.clearInStart(destHtml.parentNode)

            setTimeout(() => {
                if (insertType === 'after') {
                    destHtml.parentNode.insertBefore(contentHtml, destHtml.nextSibling)
                } else if (insertType === 'before') {
                    destHtml.parentNode.insertBefore(contentHtml, destHtml)
                } else if (insertType === 'prepend') {
                    destHtml.prepend(contentHtml)
                } else {
                    destHtml.appendChild(contentHtml)
                }
                resolve(contentHtml)
            }, this.delay)
        })
    }

    modifyParentStyle() {}

    /**
     * Don't touch, magic here !!!
     * @param model
     * @param destHtml
     * @private
     */
    _render(model, destHtml) {
        // only add base css in the first time
        if (!this.addedBaseCss) {
            this.registerBaseCss()
            this.addedBaseCss = true
        }
        const contentHtml = this.wrapContent(this.populateContent(model), model)

        if (!window.a) {
            window.a = {}
            window.t = {}
        }

        clearTimeout(window.t[this.wrapClass])

        if (!window.a[this.wrapClass]) {
            window.a[this.wrapClass] = []
        }

        contentHtml.destHtml = destHtml
        contentHtml.destHtmlText = destHtml.innerText
        contentHtml.insertType = model.insertType
        contentHtml.model = model
        if (model.type === 'campaign_social_proof') {
            window.a[this.wrapClass] = [contentHtml]
        } else {
            window.a[this.wrapClass].push(contentHtml)
        }

        window.t[this.wrapClass] = setTimeout(() => {
            const uniqueContent = this.uniqueContentHtml(window.a[this.wrapClass], destHtml)
            uniqueContent.forEach(uc => {
                if (this.checkRenderCondition(uc.model)) {
                    this.renderContent(uc, uc.destHtml, uc.insertType)
                        .then(c => {
                            this.registerEvent(uc.model, c)
                            this.modifyParentStyle(c)
                        })
                        .catch(err => {
                            throw err
                        })
                }
            })
        }, 500)
    }

    uniqueContentHtml(arrays) {
        const dict = {}
        arrays.forEach(item => {
            dict[item.className + item.id + item.destHtmlText] = item
        })
        return Object.values(dict)
    }

    render(model) {
        const willRender = this.checkRenderCondition(model)
        if (!willRender) {
            return
        }

        let bannerId = model._id
        let href = model.link
        let userId = localStorage.getItem('user_id')
        let deviceId = model.getCookie('device_id_in_server')

        this.findElementAsync(model)
            .then(destHtmlNodes => {
                for (const item of destHtmlNodes) {
                    if (this.checkRenderCondition(model)) {
                        this._render(model, item)
                        model.addEventGtm('banner_show', {
                            user_id: userId,
                            device_id: deviceId,
                            banner_id: bannerId,
                            href: href
                        })
                    }
                }
            })
            .catch(err => {
                throw err
            })
    }
}
