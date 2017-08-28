"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const util = require("util");
const chalk = require("chalk");
const errors_1 = require("../../lib/errors");
function get(env, inputs, options) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        let [p] = inputs;
        const { global, json } = options;
        if (!global && !env.project.directory) {
            throw new errors_1.FatalException(`Sorry--this won't work outside an Ionic project directory. Did you mean to print global config using ${chalk.green('--global')}?`);
        }
        const file = global ? env.config : env.project;
        const config = yield file.load();
        const [cloneDeep, get] = yield Promise.all([Promise.resolve().then(function () { return require('lodash/cloneDeep'); }), Promise.resolve().then(function () { return require('lodash/get'); })]);
        const v = cloneDeep(p ? get(config, p) : config);
        if (json) {
            process.stdout.write(JSON.stringify(v));
        }
        else {
            yield sanitize(p, v);
            env.log.msg(util.inspect(v, { colors: chalk.enabled }));
        }
    });
}
exports.get = get;
function scrubTokens(obj) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const mapValues = yield Promise.resolve().then(function () { return require('lodash/mapValues'); });
        return mapValues(obj, () => '*****');
    });
}
function sanitize(key, obj) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const assign = yield Promise.resolve().then(function () { return require('lodash/assign'); });
        if (typeof obj === 'object' && 'tokens' in obj) {
            obj['tokens'] = yield scrubTokens(obj['tokens']);
        }
        if (key === 'tokens') {
            assign(obj, yield scrubTokens(obj));
        }
    });
}
