"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const cli_utils_1 = require("@ionic/cli-utils");
const command_1 = require("@ionic/cli-utils/lib/command");
let LogoutCommand = class LogoutCommand extends command_1.Command {
    run(inputs, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!(yield this.env.session.isLoggedIn())) {
                this.env.log.info('You are already logged out.');
                return 0;
            }
            yield this.env.session.logout();
            this.env.log.ok('You are logged out.');
        });
    }
};
LogoutCommand = tslib_1.__decorate([
    command_1.CommandMetadata({
        name: 'logout',
        type: 'global',
        backends: [cli_utils_1.BACKEND_LEGACY, cli_utils_1.BACKEND_PRO],
        description: '',
        visible: false,
    })
], LogoutCommand);
exports.LogoutCommand = LogoutCommand;
