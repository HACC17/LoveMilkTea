"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path = require("path");
const cli_utils_1 = require("@ionic/cli-utils");
/**
 * Get all platforms based on platforms directory
 * TODO: should we get this from the config.xml or just the directories like app-lib
 */
function getProjectPlatforms(projectDir) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return cli_utils_1.readDir(path.join(projectDir, 'platforms'));
    });
}
exports.getProjectPlatforms = getProjectPlatforms;
/**
 * Install the platform specified using cordova
 */
function installPlatform(env, platform) {
    return env.shell.run('cordova', ['platform', 'add', '--save', platform], {});
}
exports.installPlatform = installPlatform;
