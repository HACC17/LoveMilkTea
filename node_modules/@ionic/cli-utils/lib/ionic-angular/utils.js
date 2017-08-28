"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path = require("path");
const chalk = require("chalk");
function getIonicAngularVersion(env) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const { readPackageJsonFile } = yield Promise.resolve().then(function () { return require('../utils/npm'); });
        const { prettyPath } = yield Promise.resolve().then(function () { return require('../utils/format'); });
        const ionicAngularPackageJsonFilePath = path.resolve(env.project.directory, 'node_modules', 'ionic-angular', 'package.json'); // TODO
        try {
            const ionicAngularPackageJson = yield readPackageJsonFile(ionicAngularPackageJsonFilePath);
            return ionicAngularPackageJson.version;
        }
        catch (e) {
            env.log.error(`Error with ${chalk.bold(prettyPath(ionicAngularPackageJsonFilePath))} file: ${e}`);
        }
    });
}
exports.getIonicAngularVersion = getIonicAngularVersion;
function getAppScriptsVersion(env) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const { readPackageJsonFile } = yield Promise.resolve().then(function () { return require('../utils/npm'); });
        const { prettyPath } = yield Promise.resolve().then(function () { return require('../utils/format'); });
        const appScriptsPackageJsonFilePath = path.resolve(env.project.directory, 'node_modules', '@ionic', 'app-scripts', 'package.json'); // TODO
        try {
            const appScriptsPackageJson = yield readPackageJsonFile(appScriptsPackageJsonFilePath);
            return appScriptsPackageJson.version;
        }
        catch (e) {
            env.log.error(`Error with ${chalk.bold(prettyPath(appScriptsPackageJsonFilePath))} file: ${e}`);
        }
    });
}
exports.getAppScriptsVersion = getAppScriptsVersion;
function importAppScripts(env) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const appScriptsPath = path.resolve(env.project.directory, 'node_modules', '@ionic', 'app-scripts'); // TODO
        return require(appScriptsPath);
    });
}
exports.importAppScripts = importAppScripts;
