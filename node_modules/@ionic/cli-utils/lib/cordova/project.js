"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk = require("chalk");
const errors_1 = require("../errors");
function installPlatform(env, platform) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            yield env.shell.run('cordova', ['platform', 'add', platform, '--save'], { fatalOnError: false, showError: false });
        }
        catch (e) {
            const s = String(e);
            if (s.match(/Platform [A-Za-z0-9-]+ already added/)) {
                env.log.warn(`Platform already added. Saving platforms to ${chalk.bold('config.xml')}.`);
                yield env.shell.run('cordova', ['platform', 'save'], {});
            }
            else {
                throw new errors_1.FatalException(s, typeof e.exitCode === 'undefined' ? 1 : e.exitCode);
            }
        }
    });
}
exports.installPlatform = installPlatform;
