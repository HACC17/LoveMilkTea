"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk = require("chalk");
const command_1 = require("@ionic/cli-utils/lib/command");
let BuildCommand = class BuildCommand extends command_1.Command {
    preRun(inputs, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (inputs.length > 0 && ['android', 'ios', 'wp8', 'windows', 'browser'].includes(inputs[0])) {
                this.env.log.warn(`${chalk.green('ionic build')} is for building web assets and takes no arguments. See ${chalk.green('ionic build --help')}.\n` +
                    `Ignoring argument ${chalk.green(inputs[0])}. Perhaps you meant ${chalk.green('ionic cordova build ' + inputs[0])}?\n`);
            }
        });
    }
    run(inputs, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { build } = yield Promise.resolve().then(function () { return require('@ionic/cli-utils/commands/build'); });
            yield build(this.env, inputs, options);
        });
    }
};
BuildCommand = tslib_1.__decorate([
    command_1.CommandMetadata({
        name: 'build',
        type: 'project',
        description: 'Build web assets and prepare your app for any platform targets',
        longDescription: `
${chalk.green('ionic build')} will perform an Ionic build, which compiles web assets and prepares them for deployment. For Ionic/Cordova apps, the CLI will run ${chalk.green('cordova prepare')}, which copies the built web assets into the Cordova platforms that you've installed. For full details, see ${chalk.green('ionic cordova prepare --help')}.
  `,
        exampleCommands: [
            '',
            '--prod',
        ],
        options: [
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
        ],
    })
], BuildCommand);
exports.BuildCommand = BuildCommand;
