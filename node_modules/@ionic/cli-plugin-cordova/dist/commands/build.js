"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk = require("chalk");
const cli_utils_1 = require("@ionic/cli-utils");
const cordova_1 = require("../lib/utils/cordova");
const configXml_1 = require("../lib/utils/configXml");
const base_1 = require("./base");
let BuildCommand = class BuildCommand extends base_1.CordovaCommand {
    preRun(inputs, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.checkForAssetsFolder();
            if (!inputs[0]) {
                const platform = yield this.env.prompt({
                    type: 'input',
                    name: 'platform',
                    message: `What platform would you like to build: ${chalk.green('ios')}, ${chalk.green('android')}:`
                });
                inputs[0] = platform.trim();
            }
            yield this.checkForPlatformInstallation(inputs[0]);
        });
    }
    run(inputs, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { build } = options;
            const conf = yield configXml_1.ConfigXml.load(this.env.project.directory);
            yield conf.resetContentSrc();
            yield conf.save();
            if (build) {
                yield this.env.hooks.fire('build:before', { env: this.env });
                yield this.env.hooks.fire('command:build', {
                    cmd: this,
                    env: this.env,
                    inputs,
                    options: cordova_1.generateBuildOptions(this.metadata, options)
                });
                yield this.env.hooks.fire('build:after', { env: this.env });
            }
            const response = yield this.runCordova(cordova_1.filterArgumentsForCordova(this.metadata, inputs, options));
            this.env.log.msg(response);
        });
    }
};
BuildCommand = tslib_1.__decorate([
    cli_utils_1.CommandMetadata({
        name: 'build',
        type: 'project',
        description: 'Build (prepare + compile) an Ionic project for a given platform',
        longDescription: `
Like running ${chalk.green('cordova build')} directly, but also builds web assets and provides friendly checks.
  `,
        exampleCommands: [
            'ios',
            'ios --prod --release',
            'ios --device --prod --release -- --developmentTeam="ABCD" --codeSignIdentity="iPhone Developer" --provisioningProfile="UUID"',
            'android',
            'android --prod --release -- -- --keystore=filename.keystore --alias=myalias',
            'android --prod --release -- -- --minSdkVersion=21',
            'android --prod --release -- -- --gradleArg=-PcdvBuildMultipleApks=true',
        ],
        inputs: [
            {
                name: 'platform',
                description: `The platform to build: ${chalk.green('ios')}, ${chalk.green('android')}`,
            }
        ],
        options: [
            // Build Options
            {
                name: 'build',
                description: 'Do not invoke an Ionic build',
                type: Boolean,
                default: true,
            },
            {
                name: 'prod',
                description: 'Build the application for production',
                type: Boolean,
            },
            {
                name: 'aot',
                description: 'Perform ahead-of-time compilation for this build',
                type: Boolean,
            },
            {
                name: 'minifyjs',
                description: 'Minify JS for this build',
                type: Boolean,
            },
            {
                name: 'minifycss',
                description: 'Minify CSS for this build',
                type: Boolean,
            },
            {
                name: 'optimizejs',
                description: 'Perform JS optimizations for this build',
                type: Boolean,
            },
            // Cordova Options
            {
                name: 'debug',
                description: 'Create a Cordova debug build',
                type: Boolean,
                intent: cordova_1.CORDOVA_INTENT,
            },
            {
                name: 'release',
                description: 'Create a Cordova release build',
                type: Boolean,
                intent: cordova_1.CORDOVA_INTENT,
            },
            {
                name: 'device',
                description: 'Deploy Cordova build to a device',
                type: Boolean,
                intent: cordova_1.CORDOVA_INTENT,
            },
            {
                name: 'emulator',
                description: 'Deploy Cordova build to an emulator',
                type: Boolean,
                intent: cordova_1.CORDOVA_INTENT,
            },
            {
                name: 'buildConfig',
                description: 'Use the specified Cordova build configuration',
                intent: cordova_1.CORDOVA_INTENT,
            },
        ]
    })
], BuildCommand);
exports.BuildCommand = BuildCommand;
