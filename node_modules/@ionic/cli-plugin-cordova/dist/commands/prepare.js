"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk = require("chalk");
const cli_utils_1 = require("@ionic/cli-utils");
const cordova_1 = require("../lib/utils/cordova");
const setup_1 = require("../lib/utils/setup");
const configXml_1 = require("../lib/utils/configXml");
const base_1 = require("./base");
let PrepareCommand = class PrepareCommand extends base_1.CordovaCommand {
    preRun(inputs, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.checkForAssetsFolder();
        });
    }
    run(inputs, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const [platform] = inputs;
            if (platform) {
                const conf = yield configXml_1.ConfigXml.load(this.env.project.directory);
                const platformEngine = conf.getPlatformEngine(platform);
                if (!platformEngine) {
                    const confirm = yield this.env.prompt({
                        message: `Platform ${chalk.green(platform)} is not installed! Would you like to install it?`,
                        type: 'confirm',
                        name: 'confirm',
                    });
                    if (confirm) {
                        yield setup_1.installPlatform(this.env, platform);
                    }
                    else {
                        throw this.exit(`Can't prepare for ${chalk.green(platform)} unless the platform is installed. Did you mean just ${chalk.green('ionic cordova prepare')}?`);
                    }
                }
            }
            const conf = yield configXml_1.ConfigXml.load(this.env.project.directory);
            yield conf.resetContentSrc();
            yield conf.save();
            const response = yield this.runCordova(cordova_1.filterArgumentsForCordova(this.metadata, inputs, options), {});
            this.env.log.msg(response);
        });
    }
};
PrepareCommand = tslib_1.__decorate([
    cli_utils_1.CommandMetadata({
        name: 'prepare',
        type: 'project',
        description: 'Copies assets to Cordova platforms, preparing them for native builds',
        longDescription: `
${chalk.green('ionic cordova prepare')} will do the following:
- Copy the ${chalk.bold('www/')} directory into your Cordova platforms.
- Transform ${chalk.bold('config.xml')} into platform-specific manifest files.
- Copy icons and splash screens from ${chalk.bold('resources/')} to into your Cordova platforms.
- Copy plugin files into specified platforms.

You may wish to use ${chalk.green('ionic cordova prepare')} if you run your project with Android Studio or Xcode.
  `,
        exampleCommands: ['', 'ios', 'android'],
        inputs: [
            {
                name: 'platform',
                description: `The platform you would like to prepare (e.g. ${chalk.green('ios')}, ${chalk.green('android')})`,
                required: false,
            },
        ]
    })
], PrepareCommand);
exports.PrepareCommand = PrepareCommand;
