import { PagePosition } from './PagePosition'
import { PageRule } from './PageRule'

const URL_TYPE = {
    1: 'full_url',
    3: 'rule'
}

export class Page {
    constructor(page) {
        if (!page) {
            return
        }
        this._id = page.id
        this.name = page.name
        this.fullUrl = page.fullUrl
        this.pageRule = new PageRule(page.ruleFilter)
        this.urlType = URL_TYPE[page.type]
        this.domainId = page.domainId
        this.companyId = page.companyId
        this.pageType = page.pageType
        this.pagePosition = new PagePosition(page.pagePositionDto)
    }

    isWorkingWithCurrentUrl() {
        const currentPageUrl = window.location.href
        if (this.urlType === 'full_url') {
            const urlTest =
                this.fullUrl.indexOf('?') !== -1
                    ? this.fullUrl + '&testing=1'
                    : this.fullUrl + '?testing=1'
            return this.fullUrl === currentPageUrl || urlTest === currentPageUrl
        } else {
            return this.pageRule.isWorkingWithCurrentUrl()
        }
    }
}
