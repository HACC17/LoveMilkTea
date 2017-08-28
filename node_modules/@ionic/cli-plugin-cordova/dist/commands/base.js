"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path = require("path");
const chalk = require("chalk");
const cli_utils_1 = require("@ionic/cli-utils");
const cordova_1 = require("../lib/utils/cordova");
const configXml_1 = require("../lib/utils/configXml");
const setup_1 = require("../lib/utils/setup");
exports.CORDOVA_RUN_COMMAND_OPTIONS = [
    {
        name: 'list',
        description: 'List all available Cordova targets',
        type: Boolean,
        intent: cordova_1.CORDOVA_INTENT,
    },
    {
        name: 'livereload',
        description: 'Spin up server to live-reload www files',
        type: Boolean,
        aliases: ['l'],
    },
    {
        name: 'consolelogs',
        description: 'Print out console logs to terminal',
        type: Boolean,
        aliases: ['c'],
    },
    {
        name: 'serverlogs',
        description: 'Print out dev server logs to terminal',
        type: Boolean,
        aliases: ['s'],
    },
    {
        name: 'address',
        description: 'Use specific address for dev/live-reload server',
        default: '0.0.0.0',
    },
    {
        name: 'port',
        description: 'Use specific port for the dev server',
        default: '8100',
        aliases: ['p'],
    },
    {
        name: 'livereload-port',
        description: 'Use specific port for live-reload server',
        default: '35729',
        aliases: ['r'],
    },
    {
        name: 'prod',
        description: 'Mark as a production build',
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
    {
        name: 'debug',
        description: 'Mark as a debug build',
        type: Boolean,
        intent: cordova_1.CORDOVA_INTENT,
    },
    {
        name: 'release',
        description: 'Mark as a release build',
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
        name: 'target',
        description: `Deploy Cordova build to a device (use ${chalk.green('--list')} to see all)`,
        type: String,
        intent: cordova_1.CORDOVA_INTENT,
    },
    {
        name: 'buildConfig',
        description: 'Use the specified Cordova build configuration',
        intent: cordova_1.CORDOVA_INTENT,
    },
];
class CordovaCommand extends cli_utils_1.Command {
    checkForAssetsFolder() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this.env.project.directory) {
                const wwwPath = path.join(this.env.project.directory, 'www');
                const wwwExists = yield cli_utils_1.pathExists(wwwPath); // TODO: hard-coded
                if (!wwwExists) {
                    this.env.tasks.next(`Creating ${chalk.bold(cli_utils_1.prettyPath(wwwPath))} directory for you`);
                    yield cli_utils_1.fsMkdir(wwwPath, undefined);
                    this.env.tasks.end();
                }
            }
        });
    }
    runCordova(argList, _a = {}) {
        var { fatalOnNotFound = false, truncateErrorOutput = 5000 } = _a, options = tslib_1.__rest(_a, ["fatalOnNotFound", "truncateErrorOutput"]);
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.env.shell.run('cordova', argList, Object.assign({ fatalOnNotFound, truncateErrorOutput }, options));
            }
            catch (e) {
                if (e === cli_utils_1.ERROR_SHELL_COMMAND_NOT_FOUND) {
                    const cdvInstallArgs = yield cli_utils_1.pkgManagerArgs(this.env, { pkg: 'cordova', global: true });
                    throw this.exit(`The Cordova CLI was not found on your PATH. Please install Cordova globally:\n\n` +
                        `${chalk.green(cdvInstallArgs.join(' '))}\n`);
                }
                this.env.log.nl();
                this.env.log.error('Cordova encountered an error.\nYou may get more insight by running the Cordova command above directly.\n');
                throw e;
            }
        });
    }
    checkForPlatformInstallation(runPlatform) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (runPlatform) {
                const platforms = yield setup_1.getProjectPlatforms(this.env.project.directory);
                if (!platforms.includes(runPlatform)) {
                    yield setup_1.installPlatform(this.env, runPlatform);
                }
            }
        });
    }
}
exports.CordovaCommand = CordovaCommand;
class CordovaRunCommand extends CordovaCommand {
    preRun(inputs, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.checkForAssetsFolder();
            if (options['list']) {
                const args = cordova_1.filterArgumentsForCordova(this.metadata, inputs, options);
                if (!options['device'] && !options['emulator']) {
                    if (args[0] === 'run') {
                        args.push('--device');
                    }
                    else if (args[0] === 'emulate') {
                        args.push('--emulator');
                    }
                }
                args[0] = 'run';
                yield this.runCordova(args, { showExecution: true });
                return 0;
            }
            if (!inputs[0]) {
                const platform = yield this.env.prompt({
                    type: 'input',
                    name: 'platform',
                    message: `What platform would you like to run: ${chalk.green('ios')}, ${chalk.green('android')}:`,
                });
                inputs[0] = platform.trim();
            }
            yield this.checkForPlatformInstallation(inputs[0]);
        });
    }
    run(inputs, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const isLiveReload = options['livereload'];
            const conf = yield configXml_1.ConfigXml.load(this.env.project.directory);
            yield conf.resetContentSrc();
            yield conf.save();
            if (isLiveReload) {
                yield this.env.hooks.fire('watch:before', { env: this.env });
                const [serverSettings] = yield this.env.hooks.fire('command:serve', {
                    cmd: this,
                    env: this.env,
                    inputs,
                    options: cordova_1.generateBuildOptions(this.metadata, options),
                });
                if (serverSettings.externallyAccessible === false) {
                    this.env.log.warn(`Your device or emulator may not be able to access ${chalk.bold(serverSettings.externalAddress)}.\n` +
                        `Ensure you have proper port forwarding setup from your device to your computer.`);
                }
                yield conf.writeContentSrc(`${serverSettings.protocol || 'http'}://${serverSettings.externalAddress || serverSettings.publicIp}:${serverSettings.port || serverSettings.httpPort}`);
                yield conf.save();
            }
            else {
                yield this.env.hooks.fire('build:before', { env: this.env });
                yield this.env.hooks.fire('command:build', {
                    cmd: this,
                    env: this.env,
                    inputs,
                    options: cordova_1.generateBuildOptions(this.metadata, options),
                });
                yield this.env.hooks.fire('build:after', { env: this.env });
            }
            yield this.runCordova(cordova_1.filterArgumentsForCordova(this.metadata, inputs, options), { showExecution: true });
        });
    }
}
exports.CordovaRunCommand = CordovaRunCommand;
