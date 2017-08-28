"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path = require("path");
const cli_utils_1 = require("@ionic/cli-utils");
const commands_1 = require("./commands");
const configXml_1 = require("./lib/utils/configXml");
exports.name = '@ionic/cli-plugin-cordova';
exports.version = '1.6.2';
exports.namespace = new commands_1.CordovaNamespace();
exports.namespace.source = exports.name;
function registerHooks(hooks) {
    hooks.register(exports.name, 'cordova:project:info', ({ env }) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        const conf = yield configXml_1.ConfigXml.load(env.project.directory);
        return conf.getProjectInfo();
    }));
    hooks.register(exports.name, 'command:info', () => tslib_1.__awaiter(this, void 0, void 0, function* () {
        let cordovaPlatforms;
        const cordovaVersion = yield cli_utils_1.getCommandInfo('cordova', ['-v', '--no-telemetry']);
        if (cordovaVersion) {
            cordovaPlatforms = yield cli_utils_1.getCommandInfo('cordova', ['platform', 'ls', '--no-telemetry']);
            if (cordovaPlatforms) {
                cordovaPlatforms = cordovaPlatforms.replace(/\s+/g, ' ');
                cordovaPlatforms = cordovaPlatforms.replace('Installed platforms:', '');
                cordovaPlatforms = cordovaPlatforms.replace(/Available platforms.+/, '');
                cordovaPlatforms = cordovaPlatforms.trim();
            }
        }
        return [
            { type: 'global-packages', name: 'Cordova CLI', version: cordovaVersion || 'not installed' },
            { type: 'cli-packages', name: exports.name, version: exports.version, path: path.dirname(path.dirname(__filename)) },
            { type: 'local-packages', name: 'Cordova Platforms', version: cordovaPlatforms || 'none' },
        ];
    }));
    hooks.register(exports.name, 'build:after', ({ env }) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        yield env.runcmd(['cordova', 'prepare']);
    }));
}
exports.registerHooks = registerHooks;
