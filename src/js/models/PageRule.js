export class PageRule {
    constructor(ruleFilter) {
        if (!ruleFilter) {
            this.rules = []
            return
        }
        const ruleFilterObj = JSON.parse(ruleFilter)
        this.rules = ruleFilterObj ? ruleFilterObj : []
    }

    isWorkingWithCurrentUrl() {
        const currentPageUrl = window.location.href
        let booleanExpression = ''
        for (const rule of this.rules) {
            const bool = PageRule.processRule(rule, currentPageUrl)
            if (rule.method && rule.method.toUpperCase() === 'AND') {
                booleanExpression += '&&' + bool
            } else if (rule.method && rule.method.toUpperCase() === 'OR') {
                booleanExpression += '||' + bool
            } else {
                booleanExpression += bool
            }
        }
        return eval(booleanExpression)
    }

    static buildIncludeRegex(filterValue) {
        let re = ''
        for (const value of filterValue) {
            if (re === '') {
                re += value
            } else {
                re += '|' + value
            }
        }
        return new RegExp(re, 'gi')
    }

    static processSubRule(subRule, url) {
        if (subRule.filter_operator === 'include') {
            const re = PageRule.buildIncludeRegex(subRule.filter_value)
            return re.test(url)
        } else if (subRule.filter_operator === 'exclude') {
            const re = PageRule.buildIncludeRegex(subRule.filter_value)
            return !re.test(url)
        } else if (subRule.filter_operator === 'equal') {
            return subRule.filter_value[0] === url || subRule.filter_value[0] + '?testing=1' === url
        } else if (subRule.filter_operator === 'regex') {
            const re = new RegExp(subRule.filter_value[0], 'gi')
            return re.test(url)
        }
    }

    static processRule(rule, url) {
        if (!rule.data || rule.data.length === 0) {
            return false
        }

        if (rule.data.length === 1) {
            return PageRule.processSubRule(rule.data[0], url)
        }

        let result = rule.data[1].method && rule.data[1].method.toUpperCase() === 'AND'

        if (result) {
            for (const subRule of rule.data) {
                result = result && PageRule.processSubRule(subRule, url)
            }
        } else {
            for (const subRule of rule.data) {
                result = result || PageRule.processSubRule(subRule, url)
            }
        }

        return result
    }
}
