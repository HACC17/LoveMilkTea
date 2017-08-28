"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk = require("chalk");
const errors_1 = require("../../lib/errors");
function set(env, inputs, options) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const { prettyPath } = yield Promise.resolve().then(function () { return require('../../lib/utils/format'); });
        let [p, v] = inputs;
        const { global, json, force } = options;
        if (!global && !env.project.directory) {
            throw new errors_1.FatalException(`Sorry--this won't work outside an Ionic project directory. Did you mean to set global config using ${chalk.green('--global')}?`);
        }
        const file = global ? env.config : env.project;
        const config = yield file.load();
        const [get, set] = yield Promise.all([Promise.resolve().then(function () { return require('lodash/get'); }), Promise.resolve().then(function () { return require('lodash/set'); })]);
        const oldValue = get(config, p);
        try {
            v = JSON.parse(v);
        }
        catch (e) {
            if (!(e instanceof SyntaxError)) {
                throw e;
            }
            if (json) {
                throw new errors_1.FatalException(`${chalk.green('--json')}: ${chalk.green(v)} is invalid JSON: ${chalk.red(String(e))}`);
            }
        }
        let newValue = v;
        if (oldValue && typeof oldValue === 'object' && !force) {
            throw new errors_1.FatalException(`Sorry--will not override objects or arrays without ${chalk.green('--force')}.\n` +
                `Value of ${chalk.green(p)} is: ${chalk.bold(JSON.stringify(oldValue))}`);
        }
        const valueChanged = oldValue !== newValue;
        set(config, p, newValue);
        yield file.save();
        if (global && p === 'backend' && valueChanged) {
            yield env.hooks.fire('backend:changed', { env });
        }
        if (valueChanged) {
            env.log.ok(`${chalk.green(p)} set to ${chalk.green(JSON.stringify(v))} in ${chalk.bold(prettyPath(file.filePath))}!`);
        }
        else {
            env.log.info(`${chalk.green(p)} is already set to ${chalk.bold(JSON.stringify(v))}.`);
        }
    });
}
exports.set = set;
