"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const command_1 = require("@ionic/cli-utils/lib/command");
let IonitronCommand = class IonitronCommand extends command_1.Command {
    run(inputs, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { getIonitronString, ionitronStatements } = yield Promise.resolve().then(function () { return require('@ionic/cli-utils/lib/ionitron'); });
            const locale = options['es'] ? 'es' : 'en';
            const localeStatements = ionitronStatements[locale];
            const statement = localeStatements[Math.floor(Math.random() * (localeStatements.length))];
            this.env.log.msg(getIonitronString(statement));
        });
    }
};
IonitronCommand = tslib_1.__decorate([
    command_1.CommandMetadata({
        name: 'ionitron',
        type: 'global',
        description: 'Print random ionitron messages',
        options: [
            {
                name: 'es',
                description: 'Print in spanish',
                type: Boolean,
            }
        ],
        visible: false,
    })
], IonitronCommand);
exports.IonitronCommand = IonitronCommand;
