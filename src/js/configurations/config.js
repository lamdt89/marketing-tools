const config = {
    baseUrl: process.env.API_URL || '',
    clickUrl: process.env.CLICK_URL || '',
    BOX_TYPE: {
        STATIC: 'static',
        PARTNER: 'api_partner'
    },
    SLIDE: {
        VISIBLE: 'ON',
        INVISIBLE: 'OFF'
    }
}

export default config
