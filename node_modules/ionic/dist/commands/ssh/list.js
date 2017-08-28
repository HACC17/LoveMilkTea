"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk = require("chalk");
const cli_utils_1 = require("@ionic/cli-utils");
const guards_1 = require("@ionic/cli-utils/guards");
const command_1 = require("@ionic/cli-utils/lib/command");
const base_1 = require("./base");
let SSHListCommand = class SSHListCommand extends base_1.SSHBaseCommand {
    preRun() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.checkForOpenSSH();
        });
    }
    run(inputs, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { createFatalAPIFormat } = yield Promise.resolve().then(function () { return require('@ionic/cli-utils/lib/http'); });
            const { columnar } = yield Promise.resolve().then(function () { return require('@ionic/cli-utils/lib/utils/format'); });
            const { findHostSection, getConfigPath, isDirective, loadFromPath, } = yield Promise.resolve().then(function () { return require('@ionic/cli-utils/lib/ssh-config'); });
            const token = yield this.env.session.getUserToken();
            const config = yield this.env.config.load();
            let activeFingerprint;
            let foundActiveKey = false;
            const sshConfigPath = getConfigPath();
            const conf = yield loadFromPath(sshConfigPath);
            const section = findHostSection(conf, config.git.host);
            if (section) {
                const [identityFile] = section.config.filter((line) => {
                    return isDirective(line) && line.param === 'IdentityFile';
                });
                if (isDirective(identityFile)) {
                    const output = yield this.env.shell.run('ssh-keygen', ['-E', 'sha256', '-lf', identityFile.value], { showCommand: false, fatalOnError: false });
                    activeFingerprint = output.trim().split(' ')[1];
                }
            }
            const req = this.env.client.make('GET', `/users/${config.user.id}/sshkeys`)
                .set('Authorization', `Bearer ${token}`);
            const res = yield this.env.client.do(req);
            if (!guards_1.isSSHKeyListResponse(res)) {
                throw createFatalAPIFormat(req, res);
            }
            if (res.data.length === 0) {
                this.env.log.warn(`No SSH keys found. Use ${chalk.green('ionic ssh add')} to add keys to Ionic.`);
                return;
            }
            const keysMatrix = res.data.map(sshkey => {
                const data = [sshkey.fingerprint, sshkey.name, sshkey.annotation];
                if (sshkey.fingerprint === activeFingerprint) {
                    foundActiveKey = true;
                    return data.map(v => chalk.bold(v));
                }
                return data;
            });
            const table = columnar(keysMatrix, {
                columnHeaders: ['fingerprint', 'name', 'annotation'],
            });
            this.env.log.nl();
            if (foundActiveKey) {
                this.env.log.info(`The row in ${chalk.bold('bold')} is the key that this computer is using. To change, use ${chalk.green('ionic ssh use')}.\n`);
            }
            this.env.log.msg(table);
            this.env.log.nl();
            this.env.log.ok(`Showing ${chalk.bold(String(res.data.length))} SSH key${res.data.length === 1 ? '' : 's'}.`);
            this.env.log.nl();
        });
    }
};
SSHListCommand = tslib_1.__decorate([
    command_1.CommandMetadata({
        name: 'list',
        type: 'global',
        backends: [cli_utils_1.BACKEND_PRO],
        description: 'List your SSH public keys on Ionic',
    })
], SSHListCommand);
exports.SSHListCommand = SSHListCommand;
