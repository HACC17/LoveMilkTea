"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk = require("chalk");
const cli_utils_1 = require("@ionic/cli-utils");
const cordova_1 = require("../lib/utils/cordova");
const configXml_1 = require("../lib/utils/configXml");
const resources_1 = require("../lib/resources");
const setup_1 = require("../lib/utils/setup");
const base_1 = require("./base");
let PlatformCommand = class PlatformCommand extends base_1.CordovaCommand {
    preRun(inputs, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.checkForAssetsFolder();
            inputs[0] = (typeof inputs[0] === 'undefined') ? 'ls' : inputs[0];
            inputs[0] = (inputs[0] === 'rm') ? 'remove' : inputs[0];
            inputs[0] = (inputs[0] === 'list') ? 'ls' : inputs[0];
            cli_utils_1.validate(inputs[0], 'action', [cli_utils_1.contains(['add', 'remove', 'update', 'ls', 'check', 'save'], {})]);
            // If the action is list, check, or save, then just end here.
            if (['ls', 'check', 'save'].includes(inputs[0])) {
                const response = yield this.runCordova(['platform', inputs[0]]);
                this.env.log.msg(response);
                return 0;
            }
            if (!inputs[1]) {
                const platform = yield this.env.prompt({
                    type: 'input',
                    name: 'platform',
                    message: `What platform would you like to ${inputs[0]} ${chalk.green('ios')}, ${chalk.green('android')}:`,
                });
                inputs[1] = platform.trim();
            }
            cli_utils_1.validate(inputs[1], 'platform', [cli_utils_1.validators.required]);
        });
    }
    run(inputs, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let [action, platformName] = inputs;
            const conf = yield configXml_1.ConfigXml.load(this.env.project.directory);
            yield conf.resetContentSrc();
            yield conf.save();
            const platforms = yield setup_1.getProjectPlatforms(this.env.project.directory);
            if (action === 'add' && platforms.includes(platformName)) {
                this.env.log.info(`Platform ${platformName} already exists.`);
                return;
            }
            const optionList = cordova_1.filterArgumentsForCordova(this.metadata, inputs, options);
            if ((action === 'add' || action === 'remove') && !optionList.includes('--save')) {
                optionList.push('--save');
            }
            const response = yield this.runCordova(optionList);
            this.env.log.msg(response);
            if (action === 'add' && !(options['noresources']) && ['ios', 'android', 'wp8'].includes(platformName)) {
                this.env.tasks.next(`Copying default image resources into ${chalk.bold('./resources/' + platformName)}`);
                yield resources_1.addDefaultImagesToProjectResources(this.env.project.directory, platformName);
                const conf = yield configXml_1.ConfigXml.load(this.env.project.directory);
                yield conf.ensurePlatformImages(platformName, resources_1.RESOURCES[platformName]);
                yield conf.save();
            }
            this.env.tasks.end();
        });
    }
};
PlatformCommand = tslib_1.__decorate([
    cli_utils_1.CommandMetadata({
        name: 'platform',
        type: 'project',
        description: 'Manage Cordova platform targets',
        longDescription: `
Like running ${chalk.green('cordova platform')} directly, but adds default Ionic icons and splash screen resources (during ${chalk.green('add')}) and provides friendly checks.
  `,
        exampleCommands: ['', 'add ios', 'add android', 'rm ios'],
        inputs: [
            {
                name: 'action',
                description: `${chalk.green('add')}, ${chalk.green('remove')}, or ${chalk.green('update')} a platform; ${chalk.green('ls')}, ${chalk.green('check')}, or ${chalk.green('save')} all project platforms`,
            },
            {
                name: 'platform',
                description: `The platform that you would like to add (e.g. ${chalk.green('ios')}, ${chalk.green('android')})`,
            }
        ],
        options: [
            {
                name: 'noresources',
                description: `Do not add default Ionic icons and splash screen resources (corresponds to ${chalk.green('add')})`,
                type: Boolean,
                default: false,
                aliases: ['r'],
            },
        ]
    })
], PlatformCommand);
exports.PlatformCommand = PlatformCommand;
