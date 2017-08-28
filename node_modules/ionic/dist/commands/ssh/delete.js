"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk = require("chalk");
const cli_utils_1 = require("@ionic/cli-utils");
const guards_1 = require("@ionic/cli-utils/guards");
const command_1 = require("@ionic/cli-utils/lib/command");
const base_1 = require("./base");
let SSHDeleteCommand = class SSHDeleteCommand extends base_1.SSHBaseCommand {
    preRun(inputs, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { createFatalAPIFormat } = yield Promise.resolve().then(function () { return require('@ionic/cli-utils/lib/http'); });
            if (!inputs[0]) {
                const config = yield this.env.config.load();
                const token = yield this.env.session.getUserToken();
                const req = this.env.client.make('GET', `/users/${config.user.id}/sshkeys`)
                    .set('Authorization', `Bearer ${token}`);
                const res = yield this.env.client.do(req);
                if (!guards_1.isSSHKeyListResponse(res)) {
                    throw createFatalAPIFormat(req, res);
                }
                if (res.data.length === 0) {
                    this.env.log.warn(`No SSH keys found. Use ${chalk.green('ionic ssh add')} to add keys to Ionic.`);
                }
                inputs[0] = yield this.env.prompt({
                    type: 'list',
                    name: 'id',
                    message: 'Which SSH keys would you like to delete from Ionic?',
                    choices: res.data.map(key => ({
                        name: `${key.fingerprint} ${key.name} ${key.annotation}`,
                        value: key.id,
                    })),
                });
            }
        });
    }
    run(inputs, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const id = inputs[0];
            const config = yield this.env.config.load();
            const token = yield this.env.session.getUserToken();
            const req = this.env.client.make('DELETE', `/users/${config.user.id}/sshkeys/${id}`)
                .set('Authorization', `Bearer ${token}`);
            yield this.env.client.do(req);
            this.env.log.ok(`Your public key (${chalk.bold(id)}) has been deleted from Ionic.`);
        });
    }
};
SSHDeleteCommand = tslib_1.__decorate([
    command_1.CommandMetadata({
        name: 'delete',
        type: 'global',
        backends: [cli_utils_1.BACKEND_PRO],
        description: 'Delete an SSH public key from Ionic',
        inputs: [
            {
                name: 'key-id',
                description: 'The ID of the public key to delete',
            }
        ],
    })
], SSHDeleteCommand);
exports.SSHDeleteCommand = SSHDeleteCommand;
