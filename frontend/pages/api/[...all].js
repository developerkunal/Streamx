import httpProxy from 'http-proxy'
const API_URL = process.env.API_URL // The actual URL of your API
const proxy = httpProxy.createProxyServer()
// Make sure that we don't parse JSON bodies on this route:
export const config = {
    api: {
        bodyParser: false
    }
}

export default (req, res) => {
    const live_peer = process.env.NEXT_PUBLIC_LIVE_PEER

    return new Promise((resolve, reject) => {
        proxy.web(req, res, { target: 'https://livepeer.com',
        changeOrigin: true,
        headers: {
            Authorization: `Bearer ${live_peer}` ?? ''
        } }, (err) => {
            if (err) {
                return reject(err)
            }
            resolve()
        })
    })
}