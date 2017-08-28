"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const os = require("os");
const path = require("path");
const chalk = require("chalk");
const cli_utils_1 = require("@ionic/cli-utils");
const guards_1 = require("@ionic/cli-utils/guards");
const command_1 = require("@ionic/cli-utils/lib/command");
const fs_1 = require("@ionic/cli-utils/lib/utils/fs");
const base_1 = require("./base");
let SSHAddCommand = class SSHAddCommand extends base_1.SSHBaseCommand {
    preRun(inputs, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { prettyPath } = yield Promise.resolve().then(function () { return require('@ionic/cli-utils/lib/utils/format'); });
            if (!inputs[0]) {
                const fs = yield Promise.resolve().then(function () { return require('fs'); });
                const defaultPubkeyPath = path.resolve(os.homedir(), '.ssh', 'id_rsa.pub');
                const defaultPubkeyExists = yield fs_1.pathAccessible(defaultPubkeyPath, fs.constants.R_OK);
                const pubkeyPath = yield this.env.prompt({
                    type: 'input',
                    name: 'pubkeyPath',
                    message: 'Enter the location to your public key file to upload to Ionic:',
                    default: defaultPubkeyExists ? prettyPath(defaultPubkeyPath) : undefined,
                });
                inputs[0] = pubkeyPath;
            }
        });
    }
    run(inputs, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { prettyPath } = yield Promise.resolve().then(function () { return require('@ionic/cli-utils/lib/utils/format'); });
            const { createFatalAPIFormat } = yield Promise.resolve().then(function () { return require('@ionic/cli-utils/lib/http'); });
            const { ERROR_SSH_INVALID_PUBKEY, parsePublicKeyFile } = yield Promise.resolve().then(function () { return require('@ionic/cli-utils/lib/ssh'); });
            const pubkeyPath = path.resolve(inputs[0]);
            const pubkeyName = prettyPath(pubkeyPath);
            let pubkey;
            try {
                [pubkey, , ,] = yield parsePublicKeyFile(pubkeyPath);
            }
            catch (e) {
                if (e === fs_1.ERROR_FILE_NOT_FOUND) {
                    this.env.log.error(`${chalk.bold(prettyPath(pubkeyPath))} does not appear to exist. Please specify a valid SSH public key.\n` +
                        `If you are having issues, try using ${chalk.green('ionic ssh setup')}.`);
                    return 1;
                }
                else if (e === ERROR_SSH_INVALID_PUBKEY) {
                    this.env.log.error(`${chalk.bold(pubkeyName)} does not appear to be a valid SSH public key. (Not in ${chalk.bold('authorized_keys')} file format.)\n` +
                        `If you are having issues, try using ${chalk.green('ionic ssh setup')}.`);
                    return 1;
                }
                throw e;
            }
            const config = yield this.env.config.load();
            const token = yield this.env.session.getUserToken();
            const req = this.env.client.make('POST', `/users/${config.user.id}/sshkeys`)
                .set('Authorization', `Bearer ${token}`)
                .send({ pubkey });
            try {
                const res = yield this.env.client.do(req);
                if (!guards_1.isSSHKeyResponse(res)) {
                    throw createFatalAPIFormat(req, res);
                }
                const words = res.meta.status === 201 ? 'added to' : 'updated on';
                this.env.log.ok(`Your public key (${chalk.bold(res.data.fingerprint)}) has been ${words} Ionic!`);
            }
            catch (e) {
                if (guards_1.isSuperAgentError(e) && e.response.status === 409) {
                    this.env.log.info('Pubkey already added to Ionic.');
                }
                else {
                    throw e;
                }
            }
            if (pubkeyPath.endsWith('.pub')) {
                let confirm = options['use'];
                if (!confirm) {
                    confirm = yield this.env.prompt({
                        type: 'confirm',
                        name: 'confirm',
                        message: 'Would you like to use this key as your default for Ionic?',
                    });
                }
                if (confirm) {
                    const keyPath = pubkeyPath.substring(0, pubkeyPath.length - 4); // corresponding private key, theoretically
                    const keyExists = yield fs_1.pathExists(keyPath);
                    if (keyExists) {
                        yield this.runcmd(['ssh', 'use', keyPath]);
                    }
                    else {
                        this.env.log.error(`SSH key does not exist: ${chalk.bold(prettyPath(keyPath))}.\n` +
                            `Please use ${chalk.green('ionic ssh use')} manually to use the corresponding private key.`);
                    }
                }
            }
        });
    }
};
SSHAddCommand = tslib_1.__decorate([
    command_1.CommandMetadata({
        name: 'add',
        type: 'global',
        backends: [cli_utils_1.BACKEND_PRO],
        description: 'Add an SSH public key to Ionic',
        inputs: [
            {
                name: 'pubkey-path',
                description: 'Location of public key file to add to Ionic',
            },
        ],
        options: [
            {
                name: 'use',
                description: 'Use the newly added key as your default SSH key for Ionic',
                type: Boolean,
            },
        ],
    })
], SSHAddCommand);
exports.SSHAddCommand = SSHAddCommand;
