"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const command_1 = require("@ionic/cli-utils/lib/command");
let VersionCommand = class VersionCommand extends command_1.Command {
    run(inputs, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            // can't use logger--see https://github.com/ionic-team/ionic-cli/issues/2507
            process.stdout.write(this.env.plugins.ionic.meta.version + '\n');
        });
    }
};
VersionCommand = tslib_1.__decorate([
    command_1.CommandMetadata({
        name: 'version',
        type: 'global',
        description: 'Returns the current CLI version',
        visible: false,
    })
], VersionCommand);
exports.VersionCommand = VersionCommand;
