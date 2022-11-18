import CryptoJS from 'crypto-js'

class REST {
    // attach to all request
    #headers = {
        'Content-Type': 'application/json; charset=utf-8',
        // VNT_CA: window.VNT_CA,
        caId: process.env.APP_CA_ID || 9999,
        appId: process.env.APP_ID || mkt_web,
        appHash: this.getAppHash(),
        version: process.env.APP_VERISON || '1.0'
    }
    #defaultOptions = {
        retries: 3,
        interval: 1000
    }

    constructor() {}

    _wait(time) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve()
            }, time)
        })
    }

    getAppHash() {
        let timeStamp = new Date().getTime()
        timeStamp = timeStamp / 1000 - ((timeStamp / 1000) % 300)
        const appHash = process.env.APP_HASH || 'b7be6388-388d-459e-a262-6f2842826146'
        const str = `${timeStamp}:${appHash}`
        const hash = CryptoJS.SHA256(str)
        const hashStr = CryptoJS.enc.Base64.stringify(hash)
        return hashStr
    }

    /**
     *
     * @param url
     * @param fetchOptions
     * @param retries: The number of recall
     * @param interval: The time between two recall
     * @returns {Promise<any>}
     * @private
     */
    _fetchRetry(url, fetchOptions, retries, interval) {
        const onError = err => {
            const leftRetries = retries - 1
            if (leftRetries <= 0) {
                throw err
            }
            return this._wait(interval).then(() => {
                return this._fetchRetry(url, fetchOptions, leftRetries, interval)
            })
        }
        return fetch(url, fetchOptions)
            .then(response => {
                if (response.ok) {
                    return response.json()
                } else {
                    throw new Error("Can't fetch data from server!")
                }
            })
            .catch(onError)
    }

    /**
     *
     * @param url
     * @param params
     * @param headers: Just can add more key-value to #headers but can't rewrite
     * @param options: Example {retries: 3, interval: 500}, rewrite or get #defaultOptions
     * @returns {Promise<*>}
     * @constructor
     */
    GET(url, params = {}, headers = {}, options = {}) {
        // merge headers
        Object.assign(headers, this.#headers)
        // build url with query params

        const objUrl = new URL(url)
        objUrl.search = new URLSearchParams(params).toString()
        // options
        const retries = options.retries || this.#defaultOptions.retries
        const interval = options.interval || this.#defaultOptions.interval

        return this._fetchRetry(
            objUrl.toString(),
            {
                headers: headers,
                method: 'GET'
            },
            retries,
            interval
        )
    }

    POST(url, body = {}, headers = {}, options = {}) {
        Object.assign(headers, this.#headers)
        const retries = options.retries || this.#defaultOptions.retries
        const interval = options.interval || this.#defaultOptions.interval
        return this._fetchRetry(
            url,
            {
                headers: headers,
                method: 'POST',
                body: JSON.stringify(body)
            },
            retries,
            interval
        )
    }

    PUT(url, objId, body = {}, headers = {}, options = {}) {
        Object.assign(headers, this.#headers)
        const retries = options.retries || this.#defaultOptions.retries
        const interval = options.interval || this.#defaultOptions.interval
        body['id'] = objId
        return this._fetchRetry(
            url,
            {
                headers: headers,
                method: 'PUT',
                body: JSON.stringify(body)
            },
            retries,
            interval
        )
    }

    DELETE(url, objId, headers = {}, options = {}) {
        Object.assign(headers, headers)
        const retries = options.retries || this.#defaultOptions.retries
        const interval = options.interval || this.#defaultOptions.interval
        const body = { id: objId }
        return this._fetchRetry(
            url,
            {
                headers: headers,
                method: 'DELETE',
                body: JSON.stringify(body)
            },
            retries,
            interval
        )
    }
}

const rest = new REST()
export default rest
