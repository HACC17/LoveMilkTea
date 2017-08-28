"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk = require("chalk");
const command_1 = require("@ionic/cli-utils/lib/command");
const base_1 = require("./base");
let RunCommand = class RunCommand extends base_1.CordovaRunCommand {
};
RunCommand = tslib_1.__decorate([
    command_1.CommandMetadata({
        name: 'run',
        type: 'project',
        description: 'Run an Ionic project on a connected device',
        longDescription: `
Like running ${chalk.green('cordova run')} directly, but also watches for changes in web assets and provides live-reload functionality with the ${chalk.green('--livereload')} option.

For Android and iOS, you can setup Remote Debugging on your device with browser development tools: ${chalk.bold('https://docs.ionic.io/tools/developer/#remote-debugging')}

Just like with ${chalk.green('ionic cordova build')}, you can pass additional options to the Cordova CLI using the ${chalk.bold('--')} separator.
  `,
        exampleCommands: ['', 'ios', 'ios -lcs', 'android -lcs --address localhost', 'android -lcs -- -d'],
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
