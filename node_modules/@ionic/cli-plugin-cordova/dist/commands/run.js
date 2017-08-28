"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk = require("chalk");
const cli_utils_1 = require("@ionic/cli-utils");
const base_1 = require("./base");
let RunCommand = class RunCommand extends base_1.CordovaRunCommand {
};
RunCommand = tslib_1.__decorate([
    cli_utils_1.CommandMetadata({
        name: 'run',
        type: 'project',
        description: 'Run an Ionic project on a connected device',
        longDescription: `
Like running ${chalk.green('cordova run')} directly, but also watches for changes in web assets and provides live-reload functionality with the ${chalk.green('--livereload')} option.

For Android and iOS, you can setup Remote Debugging on your device with browser development tools: ${chalk.bold('https://docs.ionic.io/tools/developer/#remote-debugging')}
  `,
        exampleCommands: ['', 'ios', 'ios -lcs', 'android --livereload -cs'],
        inputs: [
            {
                name: 'platform',
                description: `The platform to run: ${chalk.green('ios')}, ${chalk.green('android')}`,
            }
        ],
        options: base_1.CORDOVA_RUN_COMMAND_OPTIONS,
    })
], RunCommand);
exports.RunCommand = RunCommand;
