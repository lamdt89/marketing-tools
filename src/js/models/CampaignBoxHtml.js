import { CampaignBanner } from './CampaignBanner'
import find from 'lodash/find'
import forEach from 'lodash/forEach'
import { formatMoney } from '../utils/helpers'

export class CampaignBoxHtml extends CampaignBanner {
    type = 'box_html'
    regex = /\{\{\w+\}\}/g

    constructor(data) {
        super(data)
        this.boxType = data.boxType
        this.dataKey = data?.dataKey ? JSON.parse(data.dataKey) : {}
        this.dataKeyPartners = data.dataKeyPartners
        this.floatDisplayType = data.floatDisplayType
        this.contentHtml = data.contentHtml
        this.partnerId = data.partnerId
        this.templateId = data.templateId
        this.status = data.status
        this.positionType = data.positionType
        this.itemPerSlide = data?.itemPerSlide || 1
    }

    getKeysCodeFromContentHtml() {
        let data = {}
        if (!this.contentHtml) return data
        const keysCode = this.contentHtml.match(this.regex)
        if (!keysCode) return data
        const regex = /({|})/g
        const dataKey = this.dataKey
        keysCode.map(function(k) {
            const key = k.replaceAll(regex, '')
            const value = find(dataKey, function(d) {
                if (d.templateKey === key) return d
            })
            if (key && value) data = { ...data, [key]: value.partnerKey }
        })
        return data
    }

    _renderByPartnerData(dom, partnerData) {
        const keysCode = dom.match(this.regex)
        let _dom = dom
        if (!keysCode) return _dom
        const regex = /({|})/g
        for (let i = 0; i < keysCode.length; i++) {
            const key = keysCode[i].replaceAll(regex, '')
            if (key === 'old_price' || key === 'new_price') {
                _dom = _dom.replace(
                    keysCode[i],
                    !partnerData[key] ? '' : formatMoney(partnerData[key], 0, '.', '.')
                )
            } else {
                _dom = _dom.replace(keysCode[i], !partnerData[key] ? '' : partnerData[key])
            }
        }
        return _dom
    }

    _renderDot(dom) {
        let _dom = dom
        const dotLoop = '{{dot_loop}}'
        const dotEndLoop = '{{dot_end_loop}}'

        const _dotStart = _dom.search(dotLoop)
        const _dotEnd = _dom.search(dotEndLoop)

        if (_dotStart != -1 && _dotEnd != -1) {
            const dotContent = _dom.substring(_dotStart + dotLoop.length, _dotEnd)
            const _beginDot = _dom.slice(0, _dotStart)
            const _endDot = _dom.slice(_dotEnd + dotEndLoop.length, _dom.length)
            let content = ''
            let count = 1
            for (let i = 0; i < this.partnerData.length; i++) {
                if (this.partnerData.length > this.itemPerSlide && i % this.itemPerSlide === 0) {
                    content += dotContent
                        .replace(
                            'vnt-mkt-slide-indicator-1 active',
                            `vnt-mkt-slide-indicator-${count}${count === 1 ? ' active' : ''}`
                        )
                        .replace('dataIndex', count)
                    // .replace('onClickSlideIndicator(1)', `onClickSlideIndicator(${count})`)

                    count++
                }
            }
            _dom = _beginDot + content + _endDot
        }

        return _dom
    }

    getKeysCode() {
        let data = {}
        if (!this.contentHtml) return data
        const keysCode = this.contentHtml.match(this.regex)
        if (!keysCode) return data
        const regex = /({|})/g
        const dataKey = this.dataKey
        keysCode.map(function(k) {
            const key = k.replaceAll(regex, '')
            const value = find(dataKey, function(d) {
                if (d.templateKey === key) return d
            })
            if (key && value) data = { ...data, [key]: value.partnerKey }
        })
        return data
    }

    getValueNestedObj(arr, obj) {
        const [first, ...rest] = arr
        return typeof obj[first] === 'object'
            ? this.getValueNestedObj(rest, obj[first])
            : obj[first]
    }

    mapPartnerDataByKeysCode(partnerData, keysCodes) {
        let _partnerData = {}
        if (!partnerData) return _partnerData
        let partnerValue = ''
        forEach(keysCodes, (v, i) => {
            const keys = v.split('.')
            partnerValue = this.getValueNestedObj(keys, partnerData)
            if (partnerValue) _partnerData = { ..._partnerData, [i]: partnerValue }
        })
        return _partnerData
    }

    getBoxHtml() {
        if (!this.partnerData) {
            return ''
        }
        let arrDom = []
        let _partnerDataMap = {}
        let boxHtml = ''
        if (!this.contentHtml) return ''
        const displayBoxHtml = this.contentHtml
        const loop = '{{loop}}'
        const endLoop = '{{end_loop}}'

        const _start = displayBoxHtml.search(loop)
        const _end = displayBoxHtml.search(endLoop)

        const keysCode = this.getKeysCode()
        let _return = ''

        if (_start != -1 && _end != -1) {
            const _loopBox = displayBoxHtml.substring(_start + loop.length, _end)
            const _beginBox = displayBoxHtml.slice(0, _start)
            let _endBox = displayBoxHtml.slice(_end + endLoop.length, displayBoxHtml.length)
            this.partnerData.map(pd => {
                _partnerDataMap = this.mapPartnerDataByKeysCode(pd, keysCode)
                arrDom = [...arrDom, this._renderByPartnerData(_loopBox, _partnerDataMap)]
            })
            let count = 1
            const wrapper = "</div><div class='animate__animated vnt-mkt-slide vnt-mkt-slide-1'>"
            arrDom.map((d, i) => {
                if (i > 0 && i % this.itemPerSlide === 0) {
                    count++
                    boxHtml += wrapper.replace('vnt-mkt-slide-1', `vnt-mkt-slide-${count}`) + d
                } else {
                    boxHtml += d
                }
            })

            _endBox = this._renderDot(_endBox)

            _return = _beginBox + boxHtml + _endBox
        } else {
            _partnerDataMap = this.mapPartnerDataByKeysCode(this.partnerData[0], keysCode)
            _return = this._renderByPartnerData(displayBoxHtml, _partnerDataMap)
        }

        return _return
    }
}
