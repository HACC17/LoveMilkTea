"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path = require("path");
const fs_1 = require("./utils/fs");
function getAndroidSdkToolsVersion() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const androidHome = process.env.ANDROID_HOME;
        if (androidHome) {
            try {
                const f = yield fs_1.fsReadFile(path.join(androidHome, 'tools', 'source.properties'), { encoding: 'utf8' });
                for (let l of f.split('\n')) {
                    const [a, b] = l.split('=');
                    if (a === 'Pkg.Revision') {
                        return b;
                    }
                }
            }
            catch (e) {
                if (e.code !== 'ENOENT') {
                    throw e;
                }
            }
        }
        return undefined;
    });
}
exports.getAndroidSdkToolsVersion = getAndroidSdkToolsVersion;
