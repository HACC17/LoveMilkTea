"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const util = require("util");
const chalk = require("chalk");
const guards_1 = require("../guards");
const modules_1 = require("./modules");
const errors_1 = require("./errors");
const FORMAT_ERROR_BODY_MAX_LENGTH = 1000;
const CONTENT_TYPE_JSON = 'application/json';
exports.ERROR_UNKNOWN_CONTENT_TYPE = 'UNKNOWN_CONTENT_TYPE';
exports.ERROR_UNKNOWN_RESPONSE_FORMAT = 'UNKNOWN_RESPONSE_FORMAT';
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
    const superagent = modules_1.load('superagent');
    let req = superagent(method, url);
    if (proxy && req.proxy) {
        req = req.proxy(proxy);
    }
    return req;
}
exports.createRequest = createRequest;
class Client {
    constructor(host) {
        this.host = host;
    }
    make(method, path) {
        return createRequest(method, `${this.host}${path}`)
            .set('Content-Type', CONTENT_TYPE_JSON)
            .set('Accept', CONTENT_TYPE_JSON);
    }
    do(req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const res = yield req;
            const r = transformAPIResponse(res);
            if (guards_1.isAPIResponseError(r)) {
                throw new errors_1.FatalException('API request was successful, but the response output format was that of an error.\n'
                    + formatAPIError(req, r));
            }
            return r;
        });
    }
    paginate(reqgen, guard) {
        return new Paginator(this, reqgen, guard);
    }
}
exports.Client = Client;
class Paginator {
    constructor(client, reqgen, guard) {
        this.client = client;
        this.reqgen = reqgen;
        this.guard = guard;
        this.done = false;
    }
    next() {
        if (this.done) {
            return { done: true }; // TODO: why can't I exclude value?
        }
        return {
            done: false,
            value: (() => tslib_1.__awaiter(this, void 0, void 0, function* () {
                const req = this.reqgen();
                if (!this.previousReq) {
                    this.previousReq = req;
                }
                const page = this.previousReq.qs.page && !isNaN(Number(this.previousReq.qs.page)) ? this.previousReq.qs.page + 1 : 1;
                const pageSize = this.previousReq.qs.page_size && !isNaN(Number(this.previousReq.qs.page_size)) ? this.previousReq.qs.page_size : 25;
                req.query({ page, 'page_size': pageSize });
                const res = yield this.client.do(req);
                if (!this.guard(res)) {
                    throw createFatalAPIFormat(req, res);
                }
                if (res.data.length === 0 || res.data.length < pageSize) {
                    this.done = true;
                }
                this.previousReq = req;
                return res;
            }))(),
        };
    }
    [Symbol.iterator]() {
        return this;
    }
}
exports.Paginator = Paginator;
function transformAPIResponse(r) {
    if (r.status === 204) {
        r.body = { data: null, meta: { status: 204, version: '', request_id: '' } };
    }
    if (r.status !== 204 && r.type !== CONTENT_TYPE_JSON) {
        throw exports.ERROR_UNKNOWN_CONTENT_TYPE;
    }
    let j = r.body;
    if (!j.meta) {
        throw exports.ERROR_UNKNOWN_RESPONSE_FORMAT;
    }
    return j;
}
exports.transformAPIResponse = transformAPIResponse;
function createFatalAPIFormat(req, res) {
    return new errors_1.FatalException('API request was successful, but the response format was unrecognized.\n'
        + formatAPIResponse(req, res));
}
exports.createFatalAPIFormat = createFatalAPIFormat;
function formatSuperAgentError(e) {
    const res = e.response;
    const req = res.request;
    const statusCode = e.response.status;
    let f = '';
    try {
        const r = transformAPIResponse(res);
        f += formatAPIResponse(req, r);
    }
    catch (e) {
        f += `HTTP Error ${statusCode}: ${req.method.toUpperCase()} ${req.url}\n`;
        // TODO: do this only if verbose?
        f += '\n' + res.text ? res.text.substring(0, FORMAT_ERROR_BODY_MAX_LENGTH) : '<no buffered body>';
        if (res.text && res.text.length > FORMAT_ERROR_BODY_MAX_LENGTH) {
            f += ` ...\n\n[ truncated ${res.text.length - FORMAT_ERROR_BODY_MAX_LENGTH} characters ]`;
        }
    }
    return chalk.bold(chalk.red(f));
}
exports.formatSuperAgentError = formatSuperAgentError;
function formatAPIResponse(req, r) {
    if (guards_1.isAPIResponseSuccess(r)) {
        return formatAPISuccess(req, r);
    }
    else {
        return formatAPIError(req, r);
    }
}
exports.formatAPIResponse = formatAPIResponse;
function formatAPISuccess(req, r) {
    return `Request: ${req.method} ${req.url}\n`
        + `Response: ${r.meta.status}\n`
        + `Body: \n${util.inspect(r.data, { colors: chalk.enabled })}`;
}
exports.formatAPISuccess = formatAPISuccess;
function formatAPIError(req, r) {
    return `Request: ${req.method} ${req.url}\n`
        + `Response: ${r.meta.status}\n`
        + `Body: \n${util.inspect(r.error, { colors: chalk.enabled })}`;
}
exports.formatAPIError = formatAPIError;
