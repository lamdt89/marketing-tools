import config from './config'

const routes = {
    clickUrl: config.baseUrl + '/log-service/public-api/v1/campaign-tracking/sdk',
    fetchCampaignPopupUrl: config.baseUrl + '/mkt-service/public-api/v1/campaign-popup/sdk',
    fetchCampaignBannerUrl: config.baseUrl + '/mkt-service/public-api/v1/campaign-banner/sdk',
    fetchCampaignSlideUrl: config.baseUrl + '/mkt-service/public-api/v1/campaign-slide-banner/sdk',
    fetchCampaignTagUrl: config.baseUrl + '/mkt-service/public-api/v1/campaign-tag/sdk',
    fetchCampaignFloatBannerUrl:
        config.baseUrl + '/mkt-service/public-api/v1/campaign-float-banner/sdk',
    fetchSocialProofUrl: config.baseUrl + '/mkt-service/public-api/v1/social-proof/sdk',
    fetchSocialProofDataUrl: config.baseUrl + '/mkt-service/public-api/v1/social-proof/sdk/data',
    fetchBoxHtmlUrl: config.baseUrl + '/mkt-service/public-api/v1/campaign-box-html/sdk',
    fetchBoxHtmlDataUrl: config.baseUrl + '/mkt-service/public-api/v1/campaign-box-html/sdk/data'
}

export default routes
