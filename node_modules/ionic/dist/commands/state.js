"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk = require("chalk");
const command_1 = require("@ionic/cli-utils/lib/command");
let StateCommand = class StateCommand extends command_1.Command {
    run() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { columnar, indent } = yield Promise.resolve().then(function () { return require('@ionic/cli-utils/lib/utils/format'); });
            const data = [
                [`${indent(4)}${chalk.green('ionic cordova platform save')}`, `save existing installed platforms to ${chalk.bold('config.xml')}`],
                [`${indent(4)}${chalk.green('ionic cordova plugin save')}`, `save existing installed plugins to ${chalk.bold('config.xml')}`],
                [`${indent(4)}${chalk.green('ionic cordova platform --help')}`, `view help page for managing Cordova platforms`],
                [`${indent(4)}${chalk.green('ionic cordova plugin --help')}`, `view help page for managing Cordova plugins`],
                [`${indent(4)}${chalk.green('ionic cordova prepare')}`, `install platforms and plugins listed in ${chalk.bold('config.xml')}`],
            ];
            this.env.log.error(`${chalk.green('ionic state')} has been removed as of CLI 3.0.\n\n` +
                `We recommend using Cordova directly to manage Cordova plugins and platforms.\n` +
                `The following commands fulfill the old ${chalk.green('ionic state')} functionality:\n\n` +
                `${columnar(data)}\n\n` +
                `See ${chalk.bold('https://cordova.apache.org/docs/en/latest/platform_plugin_versioning_ref/')} for detailed information.\n`);
            return 1;
        });
    }
};
StateCommand = tslib_1.__decorate([
    command_1.CommandMetadata({
        name: 'state',
        type: 'global',
        description: '',
        visible: false,
    })
], StateCommand);
exports.StateCommand = StateCommand;
