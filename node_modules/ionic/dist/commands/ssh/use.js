"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path = require("path");
const chalk = require("chalk");
const cli_utils_1 = require("@ionic/cli-utils");
const command_1 = require("@ionic/cli-utils/lib/command");
const validators_1 = require("@ionic/cli-utils/lib/validators");
const fs_1 = require("@ionic/cli-utils/lib/utils/fs");
const base_1 = require("./base");
let SSHUseCommand = class SSHUseCommand extends base_1.SSHBaseCommand {
    run(inputs, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { prettyPath } = yield Promise.resolve().then(function () { return require('@ionic/cli-utils/lib/utils/format'); });
            const { ERROR_SSH_INVALID_PRIVKEY, ERROR_SSH_MISSING_PRIVKEY, validatePrivateKey } = yield Promise.resolve().then(function () { return require('@ionic/cli-utils/lib/ssh'); });
            const { ensureHostAndKeyPath, getConfigPath } = yield Promise.resolve().then(function () { return require('@ionic/cli-utils/lib/ssh-config'); });
            const keyPath = path.resolve(inputs[0]);
            try {
                yield validatePrivateKey(keyPath);
            }
            catch (e) {
                if (e === ERROR_SSH_MISSING_PRIVKEY) {
                    this.env.log.error(`${chalk.bold(keyPath)} does not appear to exist. Please specify a valid SSH private key.\n` +
                        `If you are having issues, try using ${chalk.green('ionic ssh setup')}.`);
                }
                else if (e === ERROR_SSH_INVALID_PRIVKEY) {
                    this.env.log.error(`${chalk.bold(keyPath)} does not appear to be a valid SSH private key. (Missing '-----BEGIN RSA PRIVATE KEY-----' header.)\n` +
                        `If you are having issues, try using ${chalk.green('ionic ssh setup')}.`);
                }
                else {
                    throw e;
                }
                return 1;
            }
            const { SSHConfig } = yield Promise.resolve().then(function () { return require('@ionic/cli-utils/lib/ssh-config'); });
            const sshConfigPath = getConfigPath();
            const config = yield this.env.config.load();
            const text1 = yield fs_1.fileToString(sshConfigPath);
            const conf = SSHConfig.parse(text1);
            yield ensureHostAndKeyPath(conf, config.git, keyPath);
            const text2 = SSHConfig.stringify(conf);
            if (text1 === text2) {
                this.env.log.info(`${chalk.bold(keyPath)} is already your active SSH key.`);
                return;
            }
            else {
                const { diffPatch } = yield Promise.resolve().then(function () { return require('@ionic/cli-utils/lib/diff'); });
                const diff = yield diffPatch(sshConfigPath, text1, text2);
                this.env.log.msg(diff);
                const confirm = yield this.env.prompt({
                    type: 'confirm',
                    name: 'confirm',
                    message: `May we make the above change(s) to '${prettyPath(sshConfigPath)}'?`
                });
                if (!confirm) {
                    // TODO: link to docs about manual git setup
                    return 1;
                }
            }
            yield fs_1.fsWriteFile(sshConfigPath, text2, { encoding: 'utf8', mode: 0o600 });
            this.env.log.ok(`Your active Ionic SSH key has been set to ${chalk.bold(keyPath)}!`);
        });
    }
};
SSHUseCommand = tslib_1.__decorate([
    command_1.CommandMetadata({
        name: 'use',
        type: 'global',
        backends: [cli_utils_1.BACKEND_PRO],
        description: 'Set your active Ionic SSH key',
        inputs: [
            {
                name: 'key-path',
                description: 'Location of private key file to use',
                validators: [validators_1.validators.required],
            },
        ],
    })
], SSHUseCommand);
exports.SSHUseCommand = SSHUseCommand;
