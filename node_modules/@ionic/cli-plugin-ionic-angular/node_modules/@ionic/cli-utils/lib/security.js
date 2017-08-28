"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const guards_1 = require("../guards");
const http_1 = require("./http");
class SecurityClient {
    constructor(appUserToken, client) {
        this.appUserToken = appUserToken;
        this.client = client;
    }
    getProfile(tag) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const req = this.client.make('GET', `/security/profiles/${tag}`)
                .set('Authorization', `Bearer ${this.appUserToken}`)
                .query({})
                .send();
            const res = yield this.client.do(req);
            if (!guards_1.isSecurityProfileResponse(res)) {
                throw http_1.createFatalAPIFormat(req, res);
            }
            return res.data;
        });
    }
    getProfiles({ page = 1, pageSize = 25 }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const req = this.client.make('GET', '/security/profiles')
                .set('Authorization', `Bearer ${this.appUserToken}`)
                .query({ page, 'page_size': pageSize, })
                .send();
            const res = yield this.client.do(req);
            if (!guards_1.isSecurityProfilesResponse(res)) {
                throw http_1.createFatalAPIFormat(req, res);
            }
            return res.data;
        });
    }
}
exports.SecurityClient = SecurityClient;
