import { CampaignPopupController } from './controllers/CampaignPopupController'
import { CampaignBannerController } from './controllers/CampaignBannerController'
import { CampaignTagController } from './controllers/CampaignTagController'
import { CampaignFloatBannerController } from './controllers/CampaignFloatBannerController'
import { CampaignSocialProofController } from './controllers/CampaignSocialProofController'
import { CampaignBoxHtmlController } from './controllers/CampaignBoxHtmlController'
import { CampaignSlideController } from './controllers/CampaignSlideController'

// modify core js
history.pushState = (f =>
    function pushState() {
        const ret = f.apply(this, arguments)
        window.dispatchEvent(new Event('pushstate'))
        window.dispatchEvent(new Event('locationchange'))
        return ret
    })(history.pushState)

history.replaceState = (f =>
    function replaceState() {
        const ret = f.apply(this, arguments)
        window.dispatchEvent(new Event('replacestate'))
        window.dispatchEvent(new Event('locationchange'))
        return ret
    })(history.replaceState)

window.addEventListener('popstate', () => {
    window.dispatchEvent(new Event('locationchange'))
})

function start(popup, banner, tag, floatBanner, socialProof, boxHtml, slide) {
    if (!window.MKT_LAST_START || new Date() - window.MKT_LAST_START >= 3000) {
        popup.start()
        banner.start()
        tag.start()
        floatBanner.start()
        socialProof.start()
        boxHtml.start()
        slide.start()
        window.MKT_LAST_START = new Date()
    }
}

;(function() {
    console.log('test')
    const popup = new CampaignPopupController()
    const banner = new CampaignBannerController()
    const tag = new CampaignTagController()
    const floatBanner = new CampaignFloatBannerController()
    const socialProof = new CampaignSocialProofController()
    const boxHtml = new CampaignBoxHtmlController()
    const slide = new CampaignSlideController()

    start(popup, banner, tag, floatBanner, socialProof, boxHtml, slide)

    // rerun when change page location
    window.addEventListener('locationchange', function() {
        start(popup, banner, tag, floatBanner, socialProof, boxHtml, slide)
    })
})()
