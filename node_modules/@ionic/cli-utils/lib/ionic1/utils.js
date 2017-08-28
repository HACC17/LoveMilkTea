"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path = require("path");
const chalk = require("chalk");
const fs_1 = require("../utils/fs");
function getIonic1Version(env) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const { prettyPath } = yield Promise.resolve().then(function () { return require('../utils/format'); });
        const ionicVersionFilePath = path.resolve(env.project.directory, 'www', 'lib', 'ionic', 'version.json'); // TODO
        const bowerJsonPath = path.resolve(env.project.directory, 'bower.json');
        try {
            try {
                const ionicVersionJson = yield fs_1.fsReadJsonFile(ionicVersionFilePath);
                return ionicVersionJson['version'];
            }
            catch (e) {
                env.log.warn(`Error with ${chalk.bold(prettyPath(ionicVersionFilePath))} file: ${e}, trying ${chalk.bold(prettyPath(bowerJsonPath))}.`);
                const bowerJson = yield env.project.loadBowerJson();
                let ionicEntry = bowerJson.dependencies && typeof bowerJson.dependencies['ionic'] === 'string' ? bowerJson.dependencies['ionic'] : undefined;
                if (!ionicEntry) {
                    ionicEntry = bowerJson.devDependencies && typeof bowerJson.devDependencies['ionic'] === 'string' ? bowerJson.devDependencies['ionic'] : undefined;
                }
                if (!ionicEntry) {
                    return;
                }
                const m = ionicEntry.match(/.+#(.+)/);
                if (m && m[1]) {
                    return m[1];
                }
            }
        }
        catch (e) {
            env.log.error(`Error with ${chalk.bold(prettyPath(bowerJsonPath))} file: ${e}`);
        }
    });
}
exports.getIonic1Version = getIonic1Version;
