import { JTravel } from './JTravel'
import routes from '../configurations/routes'

export function getTimeRemaining(endTime) {
    const t =
        new Date(new Date(new Date(endTime).toLocaleString('en-US') + ' UTC').toString()) -
        new Date()
    const seconds = Math.floor((t / 1000) % 60)
    const minutes = Math.floor((t / 1000 / 60) % 60)
    const hours = Math.floor((t / (1000 * 60 * 60)) % 24)
    const days = Math.floor(t / (1000 * 60 * 60 * 24))
    return {
        total: t,
        days: days,
        hours: hours,
        minutes: minutes,
        seconds: seconds
    }
}

function createSep(value_style) {
    const sep_div = document.createElement('div')
    const sep_value = document.createElement('div')
    const sep_label = document.createElement('div')
    sep_value.setAttribute('class', 'clock-div-value')
    if (value_style) {
        sep_value.style.cssText = JTravel.objectToInlineCss(value_style)
    }
    sep_label.setAttribute('class', 'clock-div-label')
    sep_value.innerHTML = ':'
    sep_div.appendChild(sep_value)
    sep_div.appendChild(sep_label)
    sep_div.setAttribute('class', 'clock-div-container')
    return sep_div
}

/**
 *
 * @param t
 * @param value_style countdown_style
 * @param label_style label_countdown_style
 * @returns {HTMLDivElement}
 */
function buildingClockBlock(t, value_style, label_style) {
    const days = t.days > 0 ? (t.days <= 9 ? '0' : '') + t.days : '00'
    const hours = t.hours > 0 ? (t.hours <= 9 ? '0' : '') + t.hours : '00'
    const minutes = t.minutes > 0 ? (t.minutes <= 9 ? '0' : '') + t.minutes : '00'
    const seconds = t.seconds > 0 ? (t.seconds <= 9 ? '0' : '') + t.seconds : '00'

    const days_div_container = document.createElement('div')
    const hours_div_container = document.createElement('div')
    const minutes_div_container = document.createElement('div')
    const seconds_div_container = document.createElement('div')

    days_div_container.setAttribute('class', 'clock-div-container')
    hours_div_container.setAttribute('class', 'clock-div-container')
    minutes_div_container.setAttribute('class', 'clock-div-container')
    seconds_div_container.setAttribute('class', 'clock-div-container')

    const days_div_value = document.createElement('div')
    const hours_div_value = document.createElement('div')
    const minutes_div_value = document.createElement('div')
    const seconds_div_value = document.createElement('div')
    //Add class
    days_div_value.setAttribute('class', 'clock-div-value')
    hours_div_value.setAttribute('class', 'clock-div-value')
    minutes_div_value.setAttribute('class', 'clock-div-value')
    seconds_div_value.setAttribute('class', 'clock-div-value')
    //Add inline-style
    if (value_style) {
        days_div_value.style.cssText = JTravel.objectToInlineCss(value_style)
        hours_div_value.style.cssText = JTravel.objectToInlineCss(value_style)
        minutes_div_value.style.cssText = JTravel.objectToInlineCss(value_style)
        seconds_div_value.style.cssText = JTravel.objectToInlineCss(value_style)
    }
    //Add value
    days_div_value.innerText = days
    hours_div_value.innerText = hours
    minutes_div_value.innerText = minutes
    seconds_div_value.innerText = seconds

    const days_div_label = document.createElement('div')
    const hours_div_label = document.createElement('div')
    const minutes_div_label = document.createElement('div')
    const seconds_div_label = document.createElement('div')
    //Add class
    days_div_label.setAttribute('class', 'clock-div-label')
    hours_div_label.setAttribute('class', 'clock-div-label')
    minutes_div_label.setAttribute('class', 'clock-div-label')
    seconds_div_label.setAttribute('class', 'clock-div-label')

    if (label_style) {
        //Add inline-style
        days_div_label.style.cssText = JTravel.objectToInlineCss(label_style)
        hours_div_label.style.cssText = JTravel.objectToInlineCss(label_style)
        minutes_div_label.style.cssText = JTravel.objectToInlineCss(label_style)
        seconds_div_label.style.cssText = JTravel.objectToInlineCss(label_style)

        //Add value
        days_div_label.innerText = 'Ngày'
        hours_div_label.innerText = 'Giờ'
        minutes_div_label.innerText = 'Phút'
        seconds_div_label.innerText = 'Giây'
    }

    days_div_container.appendChild(days_div_value)
    days_div_container.appendChild(days_div_label)
    hours_div_container.appendChild(hours_div_value)
    hours_div_container.appendChild(hours_div_label)
    minutes_div_container.appendChild(minutes_div_value)
    minutes_div_container.appendChild(minutes_div_label)
    seconds_div_container.appendChild(seconds_div_value)
    seconds_div_container.appendChild(seconds_div_label)

    const countdownContainer = document.createElement('div')
    countdownContainer.setAttribute('class', 'jtravel-countdown-container')
    if (days.length > 0) {
        countdownContainer.appendChild(days_div_container)
        countdownContainer.appendChild(createSep(value_style))
        countdownContainer.appendChild(hours_div_container)
        countdownContainer.appendChild(createSep(value_style))
        countdownContainer.appendChild(minutes_div_container)
        countdownContainer.appendChild(createSep(value_style))
        countdownContainer.appendChild(seconds_div_container)
    } else if (hours.length > 0) {
        countdownContainer.appendChild(hours_div_container)
        countdownContainer.appendChild(createSep())
        countdownContainer.appendChild(minutes_div_container)
        countdownContainer.appendChild(createSep())
        countdownContainer.appendChild(seconds_div_container)
    } else if (minutes.length > 0) {
        countdownContainer.appendChild(minutes_div_container)
        countdownContainer.appendChild(createSep())
        countdownContainer.appendChild(seconds_div_container)
    } else if (seconds.length > 0) {
        countdownContainer.appendChild(seconds_div_container)
    }

    return countdownContainer
}

export function initializeClock(id, endTime, value_style, label_style) {
    let destHtml
    if (id instanceof HTMLElement) {
        destHtml = id
    } else {
        destHtml = document.getElementById(id)
    }
    const timeInterval = setInterval(function() {
        const t = getTimeRemaining(endTime)

        destHtml.innerHTML = buildingClockBlock(t, value_style, label_style).innerHTML
        if (t.total <= 0) {
            clearInterval(timeInterval)
        }
    }, 1000)
}

export function jsonParse(data) {
    let result
    try {
        result = JSON.parse(data)
    } catch (err) {
        if (typeof data == 'string') result = data
    }
    return result
}

export function isTesting() {
    const urlParams = new URLSearchParams(window.location.search)
    const _isTesting = !!urlParams.get('testing')
    if (_isTesting) {
        sessionStorage.setItem('testing', 'true')
    } else {
        sessionStorage.removeItem('testing')
    }
    return _isTesting ? _isTesting : sessionStorage.getItem('testing') === 'true'
}

export function isSlide(count, endpoint) {
    return endpoint === routes.fetchCampaignBannerUrl && count >= 2
}

export function filterModels(models) {
    const _modelsClass = {}
    models.forEach(m => {
        m.pages.forEach(page => {
            if (page.isWorkingWithCurrentUrl()) {
                const pagePosition = page.pagePosition
                if (pagePosition.selectorQuery) {
                    if (pagePosition.selectorQuery in _modelsClass) {
                        return _modelsClass[pagePosition.selectorQuery].push(m)
                    } else {
                        return (_modelsClass[pagePosition.selectorQuery] = [m])
                    }
                }
                if (pagePosition.selectorClass) {
                    if (pagePosition.selectorClass in _modelsClass) {
                        return _modelsClass[pagePosition.selectorClass].push(m)
                    } else {
                        return (_modelsClass[pagePosition.selectorClass] = [m])
                    }
                }
                if (pagePosition.selectorId) {
                    if (`id-${pagePosition.selectorId}` in _modelsClass) {
                        return _modelsClass[`id-${pagePosition.selectorId}`].push(m)
                    } else {
                        return (_modelsClass[`id-${pagePosition.selectorId}`] = [m])
                    }
                }
            }
        })
    })
    return _modelsClass
}

export function formatMoney(amount, c, d, t) {
    let a = amount
    /*eslint no-useless-catch: "error"*/
    try {
        let cc = Math.abs(c)
        cc = isNaN(cc) ? 2 : cc

        const negativeSign = a < 0 ? '-' : ''

        const i = parseInt((a = Math.abs(Number(a) || 0).toFixed(cc))).toString()
        const j = i.length > 3 ? i.length % 3 : 0

        return (
            negativeSign +
            (j ? i.substr(0, j) + t : '') +
            i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + t) +
            (cc
                ? d +
                  Math.abs(a - i)
                      .toFixed(cc)
                      .slice(2)
                : '')
        )
    } catch (e) {
        console.log(e)
    }
}
