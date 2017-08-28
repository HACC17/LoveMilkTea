"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk = require("chalk");
const command_1 = require("@ionic/cli-utils/lib/command");
let ConfigGetCommand = class ConfigGetCommand extends command_1.Command {
    run(inputs, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { get } = yield Promise.resolve().then(function () { return require('@ionic/cli-utils/commands/config/get'); });
            yield get(this.env, inputs, options);
        });
    }
};
ConfigGetCommand = tslib_1.__decorate([
    command_1.CommandMetadata({
        name: 'get',
        type: 'global',
        description: 'Print config values',
        longDescription: `
By default, this command prints properties in your project's ${chalk.bold('ionic.config.json')} file.

For ${chalk.green('--global')} config, the CLI prints properties in the global CLI config file (${chalk.bold('~/.ionic/config.json')}).

For nested properties, separate nest levels with dots. For example, the property name ${chalk.green('user.email')} will look in the ${chalk.bold('user')} object (a root-level field in the global CLI config file) for the ${chalk.bold('email')} field.

Without a ${chalk.green('property')} argument, this command prints out the entire file contents.

If you are using this command programmatically, you can use the ${chalk.green('--json')} option.

This command attempts to sanitize config output for known sensitive fields, such as fields within the ${chalk.bold('tokens')} object in the global CLI config file. This functionality is disabled when using ${chalk.green('--json')}.
  `,
        inputs: [
            {
                name: 'property',
                description: 'The property name you wish to get',
                required: false,
            },
        ],
        options: [
            {
                name: 'global',
                description: 'Use global CLI config',
                type: Boolean,
                aliases: ['g'],
            },
            {
                name: 'json',
                description: 'Output config values in JSON',
                type: Boolean,
            },
        ],
        exampleCommands: ['', 'app_id', '--global user.email', '-g yarn'],
    })
], ConfigGetCommand);
exports.ConfigGetCommand = ConfigGetCommand;
