"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path = require("path");
const os = require("os");
const chalk = require("chalk");
const backends_1 = require("./backends");
const errors_1 = require("./errors");
const format_1 = require("./utils/format");
const fs_1 = require("./utils/fs");
const modules_1 = require("./modules");
class BaseConfig {
    constructor(directory, fileName) {
        this.fileName = fileName;
        // TODO: better way to check if in project
        if (directory) {
            this.directory = path.resolve(directory);
        }
        else {
            this.directory = '';
        }
        this.filePath = path.resolve(this.directory, fileName);
    }
    load(options = {}) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (options.disk || !this.configFile) {
                let o;
                try {
                    const stats = yield fs_1.fsStat(this.filePath);
                    if (stats.size < 5) {
                        o = {};
                    }
                }
                catch (e) {
                    if (e.code !== 'ENOENT') {
                        throw e;
                    }
                    o = {};
                }
                if (typeof o === 'undefined') {
                    try {
                        o = yield fs_1.fsReadJsonFile(this.filePath);
                    }
                    catch (e) {
                        if (e === fs_1.ERROR_FILE_INVALID_JSON) {
                            throw new errors_1.FatalException(`The config file (${chalk.bold(format_1.prettyPath(this.filePath))}) is not valid JSON format.\n\n` +
                                `Please fix any JSON errors in the file.`);
                        }
                        else {
                            throw e;
                        }
                    }
                }
                const lodash = modules_1.load('lodash');
                this.originalConfigFile = lodash.cloneDeep(o);
                o = yield this.provideDefaults(o);
                if (this.is(o)) {
                    this.configFile = o;
                }
                else {
                    throw new errors_1.FatalException(`The config file (${chalk.bold(format_1.prettyPath(this.filePath))}) has an unrecognized JSON format.\n\n` +
                        `This usually means a key had an unexpected value. Please look through it and fix any issues.\n` +
                        `If all else fails--the CLI will recreate the file if you delete it.`);
                }
            }
            return this.configFile;
        });
    }
    save(configFile) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!configFile) {
                configFile = this.configFile;
            }
            if (configFile) {
                const lodash = modules_1.load('lodash');
                if (!lodash.isEqual(configFile, this.originalConfigFile)) {
                    const dirPath = path.dirname(this.filePath);
                    try {
                        const stats = yield fs_1.fsStat(dirPath);
                        if (!stats.isDirectory()) {
                            throw `${dirPath} must be a directory it is currently a file`;
                        }
                    }
                    catch (e) {
                        if (e.code !== 'ENOENT') {
                            throw e;
                        }
                        yield fs_1.fsMkdirp(dirPath);
                    }
                    yield fs_1.fsWriteJsonFile(this.filePath, configFile, { encoding: 'utf8' });
                    this.configFile = configFile;
                    this.originalConfigFile = lodash.cloneDeep(configFile);
                }
            }
        });
    }
}
exports.BaseConfig = BaseConfig;
exports.CONFIG_FILE = 'config.json';
exports.CONFIG_DIRECTORY = path.resolve(os.homedir(), '.ionic');
class Config extends BaseConfig {
    provideDefaults(o) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const lodash = modules_1.load('lodash');
            const results = lodash.cloneDeep(o);
            if (!results.lastCommand) {
                results.lastCommand = new Date().toISOString();
            }
            if (!results.daemon) {
                results.daemon = {};
            }
            if (!results.urls) {
                results.urls = {};
            }
            if (!results.git) {
                results.git = {};
            }
            if (!results.git.host) {
                results.git.host = 'git.ionicjs.com';
            }
            if (!results.urls.api) {
                results.urls.api = 'https://api.ionic.io';
            }
            if (!results.urls.dash) {
                results.urls.dash = 'https://apps.ionic.io';
            }
            if (!results.user) {
                results.user = {};
            }
            if (!results.tokens) {
                results.tokens = {};
            }
            if (!results.tokens.appUser) {
                results.tokens.appUser = {};
            }
            if (typeof results.backend !== 'string') {
                results.backend = backends_1.BACKEND_LEGACY;
            }
            if (typeof results.telemetry === 'undefined') {
                if (results.cliFlags && typeof results.cliFlags.enableTelemetry !== 'undefined') {
                    results.telemetry = results.cliFlags.enableTelemetry;
                }
                else if (results.cliFlags && typeof results.cliFlags.telemetry !== 'undefined') {
                    results.telemetry = results.cliFlags.telemetry;
                }
                else {
                    results.telemetry = true;
                }
            }
            if (typeof results.yarn === 'undefined') {
                if (results.cliFlags && typeof results.cliFlags.yarn !== 'undefined') {
                    results.yarn = results.cliFlags.yarn;
                }
                else {
                    results.yarn = false;
                }
            }
            delete results.lastUpdated;
            results.cliFlags = {}; // TODO: this is temporary
            return results;
        });
    }
    is(j) {
        return j
            && typeof j.lastCommand === 'string'
            && typeof j.daemon === 'object'
            && typeof j.urls === 'object'
            && typeof j.urls.api === 'string'
            && typeof j.urls.dash === 'string'
            && typeof j.user === 'object'
            && typeof j.tokens === 'object'
            && typeof j.tokens.appUser === 'object'
            && typeof j.backend === 'string'
            && typeof j.telemetry === 'boolean'
            && typeof j.yarn === 'boolean';
    }
}
exports.Config = Config;
function gatherFlags(argv) {
    return {
        interactive: typeof argv['interactive'] === 'undefined' ? true : argv['interactive'],
        confirm: typeof argv['confirm'] === 'undefined' ? false : argv['confirm'],
    };
}
exports.gatherFlags = gatherFlags;
