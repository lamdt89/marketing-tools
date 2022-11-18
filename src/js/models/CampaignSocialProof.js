import { CampaignBanner } from './CampaignBanner'

export class CampaignSocialProof extends CampaignBanner {
    type = 'campaign_social_proof'
    messageRegex = /\{\{\w+\}\}/g

    constructor(data) {
        super(data)
        this.position = data.position
        this.showImage = data.showImage
        this.imageShortCode = data.imageShortCode
        this.frequency = JSON.parse(data.frequency)
        this.message = data.message
    }

    getShortCodesFromRawMessage() {
        const shortCodes = this.message.match(this.messageRegex)
        return shortCodes
            .map(function(shortCode) {
                return shortCode.replaceAll('{', '')
            })
            .map(function(shortCode) {
                return shortCode.replaceAll('}', '')
            })
    }

    getDisplayingMessage() {
        if (!this.ShortCodeDict) {
            return ''
        }
        let displayingMessage = this.message
        const rawShortCodes = this.message.match(this.messageRegex)
        const shortCodes = this.getShortCodesFromRawMessage()
        for (let i = 0; i < shortCodes.length; i++) {
            const shortCode = shortCodes[i]
            const randomIndex = this.getRandomInt(this.ShortCodeDict[shortCode].length)
            const value = this.ShortCodeDict[shortCode][randomIndex]
            if (!value) return ''
            displayingMessage = displayingMessage.replace(
                rawShortCodes[i],
                '<b>' + value.message + '</b>'
            )
        }
        return displayingMessage
    }

    getRandomInt(max) {
        return Math.floor(Math.random() * max)
    }
}
