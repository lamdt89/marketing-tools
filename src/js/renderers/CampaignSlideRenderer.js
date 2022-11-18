import { CampaignRenderer } from '../base/CampaignRenderer'
import { JTravel } from '../utils/JTravel'
import config from '../configurations/config'

export class CampaignSlideRenderer extends CampaignRenderer {
    wrapClass = 'JTravel-Slide'
    cssRule = {
        'JTravel-Slide': {
            clear: 'both'
        },
        '.jtravel-slide-container': {
            display: 'flex',
            'flex-flow': 'column wrap',
            'justify-content': 'center'
        },
        '.jtravel-slide': {
            'object-fit': 'cover',
            position: 'relative',
            overflow: 'hidden',
            width: '100%',
            'max-height': '520px'
        },
        '.jtravel-slide a': {
            position: 'absolute',
            top: 0,
            'z-index': 1,
            opacity: 0,
            width: '100%',
            visibility: 'hidden',
            transition: 'visibility 0s 1s, opacity 1s linear'
        },
        '.numberText': {
            color: ' #f2f2f2',
            'font-size': '16px',
            padding: '8px 12px',
            position: 'absolute',
            top: 0,
            right: 0
        },
        '.dots': {
            position: 'absolute',
            bottom: 0,
            left: '50%',
            display: 'flex'
        },
        '.dot': {
            cursor: 'pointer',
            border: '1px solid #ccc!important',
            'border-radius': '50%',
            'z-index': 2,
            margin: '5px',
            width: '13px',
            height: '13px'
        },
        '.next': {
            position: 'absolute',
            right: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            width: '5%',
            'z-index': 2,
            'text-align': 'end',
            cursor: 'pointer',
            color: '#fff',
            'font-size': '36px',
            padding: '10px',
            display: 'none'
        },
        '.previous': {
            position: 'absolute',
            left: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            width: '5%',
            'z-index': 2,
            cursor: 'pointer',
            color: '#fff',
            'font-size': '36px',
            padding: '10px',
            display: 'none'
        },
        '.bg-color-white': {
            'background-color': '#fff!important'
        },
        '.fadeIn': {
            visibility: 'visible !important',
            opacity: '1 !important',
            transition: 'opacity 1s linear !important'
        }
    }
    intervalSlide = 5000
    slideIndex = 0

    renderIndicator(model) {
        const wrap = document.createElement('div')
        const indicatorBtnConfig = JSON.parse(model.indicatorBtnStyle)
        if (indicatorBtnConfig.visible === config.SLIDE.INVISIBLE) return wrap

        wrap.setAttribute('class', 'dots')

        for (let i = 0; i < model.slideBannerItems.length; i++) {
            const dot = document.createElement('span')
            if (indicatorBtnConfig?.style) {
                dot.style = JTravel.objectToInlineCss({
                    ['background-color']: indicatorBtnConfig?.style?.color
                        ? `${indicatorBtnConfig.style.color}!important`
                        : '#fff!important',
                    height: indicatorBtnConfig?.style?.width
                        ? indicatorBtnConfig.style.width
                        : '13px',
                    width: indicatorBtnConfig?.style?.width
                        ? indicatorBtnConfig.style.width
                        : '13px'
                })
            }
            if (!i && indicatorBtnConfig?.activeStyle) {
                dot.style = JTravel.objectToInlineCss({
                    ['background-color']: indicatorBtnConfig?.activeStyle?.color
                        ? `${indicatorBtnConfig.activeStyle.color}!important`
                        : '#fff!important',
                    height: indicatorBtnConfig?.style?.width
                        ? indicatorBtnConfig.style.width
                        : '13px',
                    width: indicatorBtnConfig?.style?.width
                        ? indicatorBtnConfig.style.width
                        : '13px'
                })
            }

            dot.setAttribute('class', `${!i ? 'dot bg-color-white' : 'dot'}`)
            wrap.appendChild(dot)
        }

        return wrap
    }

    fixPosition(positionType, dom) {
        setTimeout(() => {
            if (positionType === 'top_right') {
                dom.style.top = 0
                dom.style.right = 0
            } else if (positionType === 'top_left') {
                dom.style.top = 0
                dom.style.left = 0
            } else if (positionType === 'bottom_right') {
                dom.style.top = 'auto'
                dom.style.bottom = 0
                dom.style.right = 0
            } else if (positionType === 'bottom_left') {
                dom.style.top = 'auto'
                dom.style.bottom = 0
                dom.style.left = 0
            } else if (positionType === 'middle_right') {
                dom.style.top = '50%'
                dom.style.transform = 'translateY(-50%)'
                dom.style.right = '0'
            } else if (positionType === 'middle_left') {
                dom.style.top = '50%'
                dom.style.transform = 'translateY(-50%)'
                dom.style.left = '0'
            }
        }, 100)
    }

    renderNumberText(index, model) {
        const div = document.createElement('div')
        const totalBannerLblStyle = JSON.parse(model.totalBannerLblStyle)
        if (totalBannerLblStyle.visible === config.SLIDE.INVISIBLE) return div
        const numberText = document.createTextNode(
            `${index + 1} / ${model.slideBannerItems.length}`
        )
        div.setAttribute('class', 'numberText')
        div.appendChild(numberText)
        if (totalBannerLblStyle?.style)
            div.style = JTravel.objectToInlineCss(totalBannerLblStyle.style)
        if (totalBannerLblStyle?.positionType)
            this.fixPosition(totalBannerLblStyle.positionType, div)
        return div
    }

    renderPrevious(model) {
        const prev = document.createElement('div')
        const actionBtnStyle = JSON.parse(model.actionBtnStyle)
        if (actionBtnStyle.visible === config.SLIDE.INVISIBLE) return prev
        prev.setAttribute('class', 'previous')
        prev.appendChild(document.createTextNode(`❮`))
        const actionStyles = actionBtnStyle.style
        if (actionBtnStyle.hoverVisible === config.SLIDE.INVISIBLE) {
            const styles = { ...actionStyles, display: 'block' }
            prev.style = JTravel.objectToInlineCss(styles)
        }

        return prev
    }

    renderNext(model) {
        const next = document.createElement('div')
        const actionBtnStyle = JSON.parse(model.actionBtnStyle)
        if (actionBtnStyle.visible === config.SLIDE.INVISIBLE) return next
        next.setAttribute('class', 'next')
        next.appendChild(document.createTextNode(`❯`))
        const actionStyles = actionBtnStyle.style
        if (actionBtnStyle.hoverVisible === config.SLIDE.INVISIBLE) {
            const styles = { ...actionStyles, display: 'block' }
            next.style = JTravel.objectToInlineCss(styles)
        }
        return next
    }

    handleChangeAction({ contentHtml, model }) {
        const previous = contentHtml.querySelectorAll('.jtravel-slide .previous')
        const next = contentHtml.querySelectorAll('.jtravel-slide .next')
        if (previous.length && next.length) {
            const slides = contentHtml.querySelectorAll('.jtravel-slide a')
            const dots = contentHtml.querySelectorAll('.jtravel-slide .dots span')
            const self = this
            next.forEach(a => {
                a.onclick = function(e) {
                    e.preventDefault()
                    e.stopPropagation()
                    const plus = this.className === 'next' ? 1 : -1
                    self.slideIndex += plus
                    if (self.slideIndex === slides.length) self.slideIndex = 0
                    for (let i = 0; i < slides.length; i++) {
                        slides[i].classList.remove('fadeIn')
                        if (dots.length) dots[i].classList.remove('bg-color-white')
                    }
                    slides[self.slideIndex].classList.add('fadeIn')
                    if (dots.length) dots[self.slideIndex].classList.add('bg-color-white')
                    self.setStylesIndicator(contentHtml, model)
                }
            })
            previous.forEach(a => {
                a.onclick = function(e) {
                    e.preventDefault()
                    e.stopPropagation()
                    const plus = this.className === 'next' ? 1 : -1
                    self.slideIndex += plus
                    if (self.slideIndex === -1) self.slideIndex = slides.length - 1
                    for (let i = 0; i < slides.length; i++) {
                        slides[i].classList.remove('fadeIn')
                        if (dots.length) dots[i].classList.remove('bg-color-white')
                    }
                    slides[self.slideIndex].classList.add('fadeIn')
                    if (dots.length) dots[self.slideIndex].classList.add('bg-color-white')
                    self.setStylesIndicator(contentHtml, model)
                }
            })
        }
    }

    handleChangeIndicator({ contentHtml, model }) {
        const _self = this
        const slides = contentHtml.querySelectorAll('.jtravel-slide a')
        const dots = contentHtml.querySelectorAll('.jtravel-slide .dots span')
        if (dots.length) {
            for (var i = 0; i < dots.length; i++) {
                dots[i].onclick = function(e) {
                    e.preventDefault()
                    e.stopPropagation()
                    let self = this
                    let position = 0
                    for (let j = 0; (self = self.previousElementSibling); position++) {
                        console.log(j)
                        // = null -> stop
                        //get position node
                    }
                    for (var j = 0; j < dots.length; j++) {
                        slides[j].classList.remove('fadeIn')
                        dots[j].classList.remove('bg-color-white')
                        slides[position].classList.add('fadeIn')
                        dots[position].classList.add('bg-color-white')
                    }
                    _self.setStylesIndicator(contentHtml, model, position)
                }
            }
        }
    }

    setStylesIndicator(contentHtml, model) {
        const dots = contentHtml.querySelectorAll('.jtravel-slide .dots span')
        const dotActive = contentHtml.querySelectorAll('.jtravel-slide .dots .bg-color-white')
        const indicatorBtnConfig = JSON.parse(model.indicatorBtnStyle)
        if (
            dots.length &&
            dotActive.length &&
            indicatorBtnConfig?.style &&
            indicatorBtnConfig?.activeStyle
        ) {
            dots.forEach(dot => {
                dot.style = JTravel.objectToInlineCss({
                    ['background-color']: indicatorBtnConfig?.style?.color
                        ? `${indicatorBtnConfig.style.color}!important`
                        : '#fff!important',
                    height: indicatorBtnConfig?.style?.width
                        ? indicatorBtnConfig.style.width
                        : '13px',
                    width: indicatorBtnConfig?.style?.width
                        ? indicatorBtnConfig.style.width
                        : '13px'
                })
            })

            dotActive[0].style = JTravel.objectToInlineCss({
                ['background-color']: indicatorBtnConfig?.activeStyle?.color
                    ? `${indicatorBtnConfig.activeStyle.color}!important`
                    : '#fff!important',
                height: indicatorBtnConfig?.style?.width ? indicatorBtnConfig.style.width : '13px',
                width: indicatorBtnConfig?.style?.width ? indicatorBtnConfig.style.width : '13px'
            })
        }
    }

    showSlides(model, contentHtml) {
        let slideIndex = 0
        const slides = contentHtml.querySelectorAll('.jtravel-slide a')
        const dots = contentHtml.querySelectorAll('.jtravel-slide .dots span')
        const img = contentHtml.querySelectorAll('.jtravel-slide img:first-child')

        let _height = 0
        if (model?.imgStyle && img) {
            const _heightValue = model.imgStyle.height.replace(/[^0-9]/g, '')
            const _heightUnit = model.imgStyle.height.replace(/[0-9]/g, '')
            if (_heightUnit === '%') {
                _height = (img[0].height * _heightValue) / 100
            }
        }
        const bannerStyle = {
            ...model.bannerStyle,
            padding: 0,
            height: img ? (_height ? _height : img[0].height) + 'px' : 'auto'
        }
        contentHtml.getElementsByClassName('jtravel-slide')[0].style = JTravel.objectToInlineCss(
            bannerStyle
        )

        const actionBtnStyle = JSON.parse(model.actionBtnStyle)
        if (
            actionBtnStyle.visible === config.SLIDE.VISIBLE &&
            actionBtnStyle.hoverVisible !== config.SLIDE.INVISIBLE
        ) {
            const actionStyles = actionBtnStyle.style
            // Khi hover vào slide
            contentHtml.onmouseover = function() {
                const styles = { ...actionStyles, display: 'block' }
                this.getElementsByClassName('next')[0].style = JTravel.objectToInlineCss(styles)
                this.getElementsByClassName('previous')[0].style = JTravel.objectToInlineCss(styles)
            }
            contentHtml.onmouseout = function() {
                const styles = { ...actionStyles, display: 'none' }
                this.getElementsByClassName('next')[0].style = JTravel.objectToInlineCss(styles)
                this.getElementsByClassName('previous')[0].style = JTravel.objectToInlineCss(styles)
            }
        }
        //Khi drag slide
        // contentHtml.ondragend = function() {
        //     console.log(111111111)
        // }

        // contentHtml.ondragstart = function() {
        //     console.log(22222222)
        // }
        const intervalSlide = parseInt(model.autoDuration)
        const _intervalSlide =
            intervalSlide && model.autoStatus ? intervalSlide * 1000 : this.intervalSlide

        const self = this
        setInterval(function() {
            for (let i = 0; i < slides.length; i++) {
                slides[i].classList.remove('fadeIn')
                if (dots.length) dots[i].classList.remove('bg-color-white')
            }
            slideIndex++
            if (slideIndex >= slides.length) {
                slideIndex = 0
            }
            slides[slideIndex].classList.add('fadeIn')
            if (dots.length) {
                dots[slideIndex].classList.add('bg-color-white')
            }
            self.setStylesIndicator(contentHtml, model)
        }, _intervalSlide)

        this.handleChangeAction({ contentHtml, model })
        this.handleChangeIndicator({ contentHtml, model })
    }

    /**
     * @param model {prototype}
     * @param imageInfo {Object} Thông tin ảnh (url, link image)
     * @returns {HTMLElement}
     */
    renderItem(model, imageInfo) {
        const img = document.createElement('img')
        img.setAttribute('src', imageInfo.image)
        // Set default style for all images
        img.style.display = 'block'
        img.style.height = model.imgStyle?.height || 'auto'
        img.style.width = model.imgStyle?.width || '100%'

        const a = document.createElement('a')
        a.setAttribute('href', imageInfo.link)

        if (!imageInfo?.link) {
            a.onclick = function(e) {
                e.preventDefault()
            }
        } else {
            if (model?.isBlank)
                a.onclick = function(e) {
                    e.preventDefault()
                    e.stopPropagation()
                    window.open(a.getAttribute('href'))
                }
        }
        if (model.isBlank) {
            a.setAttribute('target', '_blank')
        }
        a.appendChild(img)
        // Set id of campaign at the parented container
        a.setAttribute('id', imageInfo.slideBannerId)
        a.setAttribute('class', 'jtravel-slide-container')

        return a
    }

    /**
     *
     * @param model
     * @returns {HTMLElement}
     */
    populateContent(model) {
        const wrap = document.createElement('div')
        const content = document.createElement('div')

        wrap.setAttribute('class', 'jtravel-slide-wrapper')

        content.setAttribute('class', 'jtravel-slide')

        if (model?.bannerStyle) {
            wrap.style['padding-left'] = model.bannerStyle['padding-left']
            wrap.style['padding-right'] = model.bannerStyle['padding-right']
            wrap.style['padding-top'] = model.bannerStyle['padding-top']
            wrap.style['padding-bottom'] = model.bannerStyle['padding-bottom']
        }

        if (model?.indicatorBtnStyle) {
            const dots = this.renderIndicator(model)
            content.appendChild(dots)
        }

        if (model?.actionBtnStyle) {
            const prev = this.renderPrevious(model)
            const next = this.renderNext(model)
            content.appendChild(prev)
            content.appendChild(next)
        }

        model.slideBannerItems.forEach((item, index) => {
            const _item = this.renderItem(model, item)
            _item.appendChild(this.renderNumberText(index, model))
            if (!index) _item.setAttribute('class', 'jtravel-slide-container fadeIn')
            content.appendChild(_item)
        })
        wrap.appendChild(content)
        return wrap
    }

    registerEvent(model, contentHtml) {
        this.showSlides(model, contentHtml)
        super.registerEvent(model, contentHtml)
    }
}
