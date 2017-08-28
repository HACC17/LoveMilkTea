"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk = require("chalk");
const cli_utils_1 = require("@ionic/cli-utils");
const cordova_1 = require("../lib/utils/cordova");
const configXml_1 = require("../lib/utils/configXml");
const base_1 = require("./base");
let CompileCommand = class CompileCommand extends base_1.CordovaCommand {
    preRun(inputs, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.checkForAssetsFolder();
            if (!inputs[0]) {
                const platform = yield this.env.prompt({
                    type: 'input',
                    name: 'platform',
                    message: `What platform would you like to compile ${chalk.green('ios')}, ${chalk.green('android')}:`
                });
                inputs[0] = platform.trim();
            }
            yield this.checkForPlatformInstallation(inputs[0]);
        });
    }
    run(inputs, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const conf = yield configXml_1.ConfigXml.load(this.env.project.directory);
            yield conf.resetContentSrc();
            yield conf.save();
            const response = yield this.runCordova(cordova_1.filterArgumentsForCordova(this.metadata, inputs, options));
            this.env.log.msg(response);
        });
    }
};
CompileCommand = tslib_1.__decorate([
    cli_utils_1.CommandMetadata({
        name: 'compile',
        type: 'project',
        description: 'Compile native platform code',
        longDescription: `
Like running ${chalk.green('cordova compile')} directly, but provides friendly checks.
  `,
        exampleCommands: ['ios'],
        inputs: [
            {
                name: 'platform',
                description: `The platform to compile: ${chalk.green('ios')}, ${chalk.green('android')}`,
            }
        ],
    })
], CompileCommand);
exports.CompileCommand = CompileCommand;
