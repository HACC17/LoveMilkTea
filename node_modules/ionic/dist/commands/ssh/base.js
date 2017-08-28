"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk = require("chalk");
const command_1 = require("@ionic/cli-utils/lib/command");
class SSHBaseCommand extends command_1.Command {
    checkForOpenSSH() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { ERROR_SHELL_COMMAND_NOT_FOUND } = yield Promise.resolve().then(function () { return require('@ionic/cli-utils/lib/shell'); });
            try {
                yield this.env.shell.run('ssh', ['-V'], { showCommand: false, fatalOnNotFound: false });
            }
            catch (e) {
                if (e !== ERROR_SHELL_COMMAND_NOT_FOUND) {
                    throw e;
                }
                this.env.log.error(`Command not found: ${chalk.bold('ssh')}`);
                this.env.log.warn('OpenSSH not found on your computer.'); // TODO: more helpful message
                return 1;
            }
        });
    }
}
exports.SSHBaseCommand = SSHBaseCommand;
