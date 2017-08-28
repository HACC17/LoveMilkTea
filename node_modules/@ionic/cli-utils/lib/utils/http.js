"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getGlobalProxy() {
    const envvars = ['IONIC_HTTP_PROXY', 'HTTPS_PROXY', 'HTTP_PROXY', 'PROXY', 'https_proxy', 'http_proxy', 'proxy'];
    for (let envvar of envvars) {
        if (process.env[envvar]) {
            return [process.env[envvar], envvar];
        }
    }
    return [undefined, undefined];
}
exports.getGlobalProxy = getGlobalProxy;
function createRequest(method, url) {
    const [proxy,] = getGlobalProxy();
    const superagent = require('superagent');
    let req = superagent(method, url);
    if (proxy && req.proxy) {
        req = req.proxy(proxy);
    }
    return req;
}
exports.createRequest = createRequest;
