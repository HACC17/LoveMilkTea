"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk = require("chalk");
const cli_utils_1 = require("@ionic/cli-utils");
const command_1 = require("@ionic/cli-utils/lib/command");
const fs_1 = require("@ionic/cli-utils/lib/utils/fs");
const base_1 = require("./base");
let SSHSetupCommand = class SSHSetupCommand extends base_1.SSHBaseCommand {
    preRun() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.checkForOpenSSH();
        });
    }
    run(inputs, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { prettyPath } = yield Promise.resolve().then(function () { return require('@ionic/cli-utils/lib/utils/format'); });
            const { getGeneratedPrivateKeyPath } = yield Promise.resolve().then(function () { return require('@ionic/cli-utils/lib/ssh'); });
            const { getConfigPath } = yield Promise.resolve().then(function () { return require('@ionic/cli-utils/lib/ssh-config'); });
            const config = yield this.env.config.load();
            const CHOICE_AUTOMATIC = 'automatic';
            const CHOICE_MANUAL = 'manual';
            const CHOICE_SKIP = 'skip';
            const CHOICE_IGNORE = 'ignore';
            if (config.git.setup) {
                const rerun = yield this.env.prompt({
                    type: 'confirm',
                    name: 'confirm',
                    message: `SSH setup wizard has run before. Would you like to run it again?`,
                });
                if (!rerun) {
                    return 0;
                }
            }
            else {
                this.env.log.info(`Looks like you haven't configured your SSH settings yet.`);
            }
            // TODO: link to docs about manual git setup
            const setupChoice = yield this.env.prompt({
                type: 'list',
                name: 'setupChoice',
                message: `How would you like to connect to Ionic Pro?`,
                choices: [
                    {
                        name: 'Automatically setup new a SSH key pair for Ionic Pro',
                        value: CHOICE_AUTOMATIC,
                    },
                    {
                        name: 'Use an existing SSH key pair',
                        value: CHOICE_MANUAL,
                    },
                    {
                        name: 'Skip for now',
                        value: CHOICE_SKIP,
                    },
                    {
                        name: 'Ignore this prompt forever',
                        value: CHOICE_IGNORE,
                    },
                ],
            });
            if (setupChoice === CHOICE_AUTOMATIC) {
                const sshconfigPath = getConfigPath();
                const keyPath = yield getGeneratedPrivateKeyPath(this.env);
                const pubkeyPath = `${keyPath}.pub`;
                const [pubkeyExists, keyExists] = yield Promise.all([fs_1.pathExists(keyPath), fs_1.pathExists(pubkeyPath)]);
                if (!pubkeyExists && !keyExists) {
                    this.env.log.info('The automatic SSH setup will do the following:\n' +
                        `1) Generate a new SSH key pair with OpenSSH (will not overwrite any existing keys).\n` +
                        `2) Upload the generated SSH public key to our server, registering it on your account.\n` +
                        `3) Modify your SSH config (${chalk.bold(prettyPath(sshconfigPath))}) to use the generated SSH private key for our server(s).`);
                    const confirm = yield this.env.prompt({
                        type: 'confirm',
                        name: 'confirm',
                        message: 'May we proceed?',
                    });
                    if (!confirm) {
                        return 1;
                    }
                }
                if (pubkeyExists && keyExists) {
                    this.env.log.info(`Using your previously generated key: ${chalk.bold(prettyPath(keyPath))}.\n` +
                        `You can generate a new one by deleting it.`);
                }
                else {
                    yield this.runcmd(['ssh', 'generate', keyPath]);
                }
                yield this.runcmd(['ssh', 'add', pubkeyPath, '--use']);
            }
            else if (setupChoice === CHOICE_MANUAL) {
                yield this.runcmd(['ssh', 'add']);
            }
            if (setupChoice === CHOICE_SKIP) {
                this.env.log.warn(`Skipping for now. You can configure your SSH settings using ${chalk.green('ionic ssh setup')}.`);
            }
            else {
                if (setupChoice === CHOICE_IGNORE) {
                    this.env.log.ok(`We won't pester you about SSH settings anymore!`);
                }
                else {
                    this.env.log.ok('SSH setup successful!');
                    config.git.setup = true;
                }
            }
        });
    }
};
SSHSetupCommand = tslib_1.__decorate([
    command_1.CommandMetadata({
        name: 'setup',
        type: 'global',
        backends: [cli_utils_1.BACKEND_PRO],
        description: 'Setup your Ionic SSH keys automatically',
    })
], SSHSetupCommand);
exports.SSHSetupCommand = SSHSetupCommand;
