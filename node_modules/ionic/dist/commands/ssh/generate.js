"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path = require("path");
const chalk = require("chalk");
const cli_utils_1 = require("@ionic/cli-utils");
const command_1 = require("@ionic/cli-utils/lib/command");
const fs_1 = require("@ionic/cli-utils/lib/utils/fs");
const base_1 = require("./base");
let SSHGenerateCommand = class SSHGenerateCommand extends base_1.SSHBaseCommand {
    preRun(inputs, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.checkForOpenSSH();
            const config = yield this.env.config.load();
            yield this.env.session.getUserToken();
            if (!options['annotation']) {
                options['annotation'] = config.user.email;
            }
        });
    }
    run(inputs, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { prettyPath } = yield Promise.resolve().then(function () { return require('@ionic/cli-utils/lib/utils/format'); });
            const { getGeneratedPrivateKeyPath } = yield Promise.resolve().then(function () { return require('@ionic/cli-utils/lib/ssh'); });
            const { bits, annotation } = options;
            const keyPath = inputs[0] ? path.resolve(String(inputs[0])) : yield getGeneratedPrivateKeyPath(this.env);
            const keyPathDir = path.dirname(keyPath);
            const pubkeyPath = `${keyPath}.pub`;
            if (!(yield fs_1.pathExists(keyPathDir))) {
                yield fs_1.fsMkdirp(keyPathDir, 0o700);
                this.env.log.info(`Created ${chalk.bold(prettyPath(keyPathDir))} directory for you.\n`);
            }
            if (yield fs_1.pathExists(keyPath)) {
                const confirm = yield this.env.prompt({
                    type: 'confirm',
                    name: 'confirm',
                    message: `Key ${chalk.bold(prettyPath(keyPath))} exists. Overwrite?`,
                });
                if (confirm) {
                    yield fs_1.fsUnlink(keyPath);
                }
                else {
                    this.env.log.info(`Not overwriting ${chalk.bold(prettyPath(keyPath))}.`);
                    return 0;
                }
            }
            this.env.log.info(`You will be prompted to provide a ${chalk.bold('passphrase')}, which is ` +
                'used to protect your private key should you lose it. (If someone has your ' +
                'private key, they can impersonate you!) Passphrases are recommended, but not required.');
            yield this.env.close();
            const shellOptions = { stdio: 'inherit', showCommand: false, showExecution: false, showError: false };
            yield this.env.shell.run('ssh-keygen', ['-q', '-t', 'rsa', '-b', String(bits), '-C', String(annotation), '-f', keyPath], shellOptions);
            yield this.env.open();
            this.env.log.ok('A new pair of SSH keys has been generated!\n' +
                `Private Key (${chalk.bold(prettyPath(keyPath))}): Keep this safe!\n` +
                `Public Key (${chalk.bold(prettyPath(pubkeyPath))}): Give this to all your friends!`);
            this.env.log.info('Next steps:\n' +
                `- Add your public key to Ionic: ${chalk.green('ionic ssh add ' + prettyPath(pubkeyPath))}\n` +
                `- Use your private key for secure communication with Ionic: ${chalk.green('ionic ssh use ' + prettyPath(keyPath))}`);
        });
    }
};
SSHGenerateCommand = tslib_1.__decorate([
    command_1.CommandMetadata({
        name: 'generate',
        type: 'global',
        backends: [cli_utils_1.BACKEND_PRO],
        description: 'Generates a private and public SSH key pair',
        inputs: [
            {
                name: 'key-path',
                description: 'Destination of private key file',
                required: false,
            },
        ],
        options: [
            {
                name: 'bits',
                description: 'Number of bits in the key',
                aliases: ['b'],
                default: '2048',
            },
            {
                name: 'annotation',
                description: 'Annotation (comment) in public key. Your Ionic email address will be used',
                aliases: ['C'],
            }
        ],
    })
], SSHGenerateCommand);
exports.SSHGenerateCommand = SSHGenerateCommand;
