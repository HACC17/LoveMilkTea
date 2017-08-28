"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk = require("chalk");
const command_1 = require("@ionic/cli-utils/lib/command");
const validators_1 = require("@ionic/cli-utils/lib/validators");
let TelemetryCommand = class TelemetryCommand extends command_1.Command {
    run(inputs, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const config = yield this.env.config.load();
            const [status] = inputs;
            const enableTelemetry = config.telemetry;
            if (typeof status === 'string') {
                config.telemetry = status.toLowerCase() === 'on';
            }
            if (typeof status === 'string' || enableTelemetry !== config.telemetry) {
                this.env.log.ok(`Telemetry: ${chalk.bold(config.telemetry ? 'ON' : 'OFF')}`);
            }
            else {
                this.env.log.msg(`Telemetry: ${chalk.bold(config.telemetry ? 'ON' : 'OFF')}`);
            }
            if (config.telemetry) {
                this.env.log.msg('Thank you for making the CLI better! ❤️');
            }
        });
    }
};
TelemetryCommand = tslib_1.__decorate([
    command_1.CommandMetadata({
        name: 'telemetry',
        type: 'global',
        description: 'Opt in and out of telemetry',
        inputs: [
            {
                name: 'status',
                description: `${chalk.green('on')} or ${chalk.green('off')}`,
                validators: [validators_1.contains(['on', 'off'], { caseSensitive: false })],
                required: false,
            }
        ],
    })
], TelemetryCommand);
exports.TelemetryCommand = TelemetryCommand;
