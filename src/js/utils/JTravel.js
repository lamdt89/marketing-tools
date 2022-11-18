import { jsonParse } from './helpers'

export class JTravel {
    constructor(querySelector) {
        if (/^#.+$/.test(querySelector)) {
            this.el = document.getElementById(querySelector)
        } else if (/^\..+$/.test(querySelector)) {
            this.el = document.getElementsByClassName(querySelector)
        } else if (querySelector instanceof HTMLElement) {
            this.el = querySelector
        } else {
            this.el = document.querySelector(querySelector)
        }
    }

    notExists() {
        return !this.el
    }

    css(cssObj = {}) {
        let cssText = ''
        for (const key in cssObj) {
            if (Object.prototype.hasOwnProperty.call(cssObj, key)) {
                cssText += key + ':' + cssObj[key] + ';'
            }
        }
        this.el.style.cssText = cssText
    }

    static objectToCss(obj) {
        let cssText = ''
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                if (key === '_') {
                    cssText += obj[key]
                } else {
                    const subObject = obj[key]
                    let subObjectText = ''
                    for (const _key in subObject) {
                        if (Object.prototype.hasOwnProperty.call(subObject, _key)) {
                            subObjectText += _key + ':' + subObject[_key] + ';'
                        }
                    }
                    cssText += key + '{' + subObjectText + '}'
                }
            }
        }
        return cssText
    }

    /**
     * Check current device
     * @returns {boolean}
     */
    static isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/ig.test(navigator.userAgent.toLowerCase());
    }

    static objectToInlineCss(obj) {
        if (typeof obj === 'string') obj = jsonParse(obj)
        let res = ''
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                res += key + ':' + obj[key] + ';'
            }
        }
        return res
    }
}
