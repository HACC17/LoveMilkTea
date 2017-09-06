"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk = require("chalk");
const guards_1 = require("../guards");
const errors_1 = require("./errors");
const http_1 = require("./http");
class BaseSession {
    constructor(config, project, client) {
        this.config = config;
        this.project = project;
        this.client = client;
    }
    isLoggedIn() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const c = yield this.config.load();
            return typeof c.tokens.user === 'string';
        });
    }
    logout() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const c = yield this.config.load();
            c.user = {};
            c.tokens.appUser = {};
            delete c.tokens.user;
            c.git.setup = false;
        });
    }
    getUserToken() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const c = yield this.config.load();
            if (!c.tokens.user) {
                throw new errors_1.FatalException(`Oops, sorry! You'll need to log in:\n\n    ${chalk.green('ionic login')}\n\n` +
                    `You can create a new account by signing up:\n\n    ${chalk.green('ionic signup')}\n`);
            }
            return c.tokens.user;
        });
    }
}
exports.BaseSession = BaseSession;
class CloudSession extends BaseSession {
    login(email, password) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const req = this.client.make('POST', '/login')
                .send({ email, password });
            try {
                const res = yield this.client.do(req);
                if (!guards_1.isLegacyLoginResponse(res)) {
                    throw http_1.createFatalAPIFormat(req, res);
                }
                const { token, user_id } = res.data;
                const c = yield this.config.load();
                if (c.user.id !== user_id) {
                    yield this.logout();
                }
                c.user.id = user_id;
                c.user.email = email;
                c.tokens.user = token;
            }
            catch (e) {
                if (guards_1.isSuperAgentError(e) && e.response.status === 401) {
                    throw new errors_1.FatalException(chalk.red('Incorrect email or password'));
                }
                throw e;
            }
        });
    }
    getAppUserToken(app_id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!app_id) {
                app_id = yield this.project.loadAppId();
            }
            const c = yield this.config.load();
            if (!c.tokens.appUser[app_id]) {
                const token = yield this.getUserToken();
                const paginator = this.client.paginate(() => this.client.make('GET', '/auth/tokens').set('Authorization', `Bearer ${token}`).query({ 'page_size': 100, type: 'app-user' }), guards_1.isAuthTokensResponse);
                for (let r of paginator) {
                    const res = yield r;
                    for (let token of res.data) {
                        c.tokens.appUser[token.details.app_id] = token.token;
                    }
                }
            }
            // TODO: if this is a new app, an app-user token may not exist for the user
            // TODO: if tokens are invalidated, what do (hint: app tokens)
            if (!c.tokens.appUser[app_id]) {
                throw new errors_1.FatalException(`A token does not exist for your account on app ${chalk.bold(app_id)}.`);
            }
            return c.tokens.appUser[app_id];
        });
    }
}
exports.CloudSession = CloudSession;
class ProSession extends BaseSession {
    login(email, password) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const req = this.client.make('POST', '/login')
                .send({ email, password, source: 'cli' });
            try {
                const res = yield this.client.do(req);
                if (!guards_1.isProLoginResponse(res)) {
                    throw http_1.createFatalAPIFormat(req, res);
                }
                const { token, user } = res.data;
                const c = yield this.config.load();
                const user_id = String(user.id);
                if (c.user.id !== user_id) {
                    yield this.logout();
                }
                c.user.id = user_id;
                c.user.email = email;
                c.tokens.user = token;
            }
            catch (e) {
                if (guards_1.isSuperAgentError(e) && e.response.status === 401) {
                    throw new errors_1.FatalException(chalk.red('Incorrect email or password'));
                }
                throw e;
            }
        });
    }
    getAppUserToken(app_id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.getUserToken();
        });
    }
}
exports.ProSession = ProSession;
