"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const backends_1 = require("./backends");
const modules_1 = require("./modules");
const uuid_1 = require("./uuid");
const GA_CODE = 'UA-44023830-30';
class Telemetry {
    constructor({ config, client, session, plugin, project }) {
        this.config = config;
        this.plugin = plugin;
        this.client = client;
        this.session = session;
        this.project = project;
    }
    setupGATracker() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const Leek = modules_1.load('leek'); // TODO: typescript bug? can't await import
            const config = yield this.config.load();
            if (!config.tokens.telemetry) {
                config.tokens.telemetry = uuid_1.generateUUID();
            }
            this.gaTracker = new Leek({
                name: config.tokens.telemetry,
                trackingCode: GA_CODE,
                globalName: 'ionic',
                version: this.plugin.version,
                silent: config.telemetry !== true,
            });
        });
    }
    resetToken() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const config = yield this.config.load();
            config.tokens.telemetry = uuid_1.generateUUID();
        });
    }
    sendCommand(command, args) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!this.gaTracker) {
                yield this.setupGATracker();
            }
            const messageList = [];
            const name = 'command execution';
            const prettyArgs = args.map(a => a.includes(' ') ? `"${a}"` : a);
            const message = messageList.concat([command], prettyArgs).join(' ');
            yield Promise.all([
                (() => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    yield this.gaTracker.track({ name, message });
                }))(),
                (() => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    const config = yield this.config.load();
                    if (config.backend === backends_1.BACKEND_PRO) {
                        let appId;
                        if (this.project.directory) {
                            const project = yield this.project.load();
                            appId = project.app_id;
                        }
                        const now = new Date().toISOString();
                        const isLoggedIn = yield this.session.isLoggedIn();
                        let req = this.client.make('POST', '/events/metrics');
                        if (isLoggedIn) {
                            const token = yield this.session.getUserToken();
                            req = req.set('Authorization', `Bearer ${token}`);
                        }
                        req = req.send({
                            'metrics': [
                                {
                                    'name': 'cli_command_metrics',
                                    'timestamp': now,
                                    'session_id': config.tokens.telemetry,
                                    'source': 'cli',
                                    'value': {
                                        'command': command,
                                        'arguments': prettyArgs.join(' '),
                                        'version': this.plugin.version,
                                        'node_version': process.version,
                                        'app_id': appId,
                                    },
                                },
                            ],
                            'sent_at': now,
                        });
                        try {
                            yield this.client.do(req);
                        }
                        catch (e) {
                            // TODO
                        }
                    }
                }))(),
            ]);
        });
    }
    sendError(error, type) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.gaTracker.trackError({
                description: error.message + ' ' + error.stack,
                isFatal: true,
            });
        });
    }
}
exports.Telemetry = Telemetry;
