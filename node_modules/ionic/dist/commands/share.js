"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk = require("chalk");
const command_1 = require("@ionic/cli-utils/lib/command");
let ShareCommand = class ShareCommand extends command_1.Command {
    run() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const config = yield this.env.config.load();
            this.env.log.error(`${chalk.green('ionic share')} has been removed as of CLI 3.0.\n` +
                `The functionality now exists in the Ionic Dashboard: ${chalk.bold(config.urls.dash)}`);
            return 1;
        });
    }
};
ShareCommand = tslib_1.__decorate([
    command_1.CommandMetadata({
        name: 'share',
        type: 'global',
        description: '',
        visible: false,
    })
], ShareCommand);
exports.ShareCommand = ShareCommand;
