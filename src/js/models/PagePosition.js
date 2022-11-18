export class PagePosition {
    constructor(position) {
        if (!position) {
            return
        }
        this._id = position.id
        this.domainId = position.domainId
        this.companyId = position.companyId
        this.insertType = position.behaviorType

        if (position.objectType === 'id') {
            this.selectorId = position.objectName
        } else if (position.objectType === 'class') {
            this.selectorClass = position.objectName
        } else if (position.objectType === 'query') {
            this.selectorQuery = position.objectName
        }
    }
}
