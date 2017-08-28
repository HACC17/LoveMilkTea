"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const command_1 = require("@ionic/cli-utils/lib/command");
let HelpCommand = class HelpCommand extends command_1.Command {
    run(inputs, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { showHelp } = yield Promise.resolve().then(function () { return require('@ionic/cli-utils/lib/help'); });
            showHelp(this.env, inputs);
        });
    }
};
HelpCommand = tslib_1.__decorate([
    command_1.CommandMetadata({
        name: 'help',
        type: 'global',
        description: 'Provides help for a certain command',
        exampleCommands: ['start'],
        inputs: [
            {
                name: 'command',
                description: 'The command you desire help with',
                required: false,
            }
        ],
        visible: false,
    })
], HelpCommand);
exports.HelpCommand = HelpCommand;
