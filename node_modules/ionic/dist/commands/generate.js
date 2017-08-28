"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk = require("chalk");
const validators_1 = require("@ionic/cli-utils/lib/validators");
const command_1 = require("@ionic/cli-utils/lib/command");
const TYPE_CHOICES = ['component', 'directive', 'page', 'pipe', 'provider', 'tabs'];
let GenerateCommand = class GenerateCommand extends command_1.Command {
    preRun(inputs, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const project = yield this.env.project.load();
            if (project.type !== 'ionic-angular') {
                throw this.exit('Generators are only supported in Ionic Angular projects.');
            }
            if (!inputs[0]) {
                const generatorType = yield this.env.prompt({
                    type: 'list',
                    name: 'generatorType',
                    message: 'What would you like to generate:',
                    choices: TYPE_CHOICES,
                });
                inputs[0] = generatorType;
            }
            if (!inputs[1]) {
                const generatorName = yield this.env.prompt({
                    type: 'input',
                    name: 'generatorName',
                    message: 'What should the name be?',
                    validate: v => validators_1.validators.required(v, 'name')
                });
                inputs[1] = generatorName;
            }
            if (!this.env.flags.interactive && inputs[0] === 'tabs') {
                this.env.log.error(`Cannot generate tabs without prompts. Run without ${chalk.green('--no-interactive')}.`);
                return 1;
            }
        });
    }
    run(inputs, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const [type, name] = inputs;
            const { generate } = yield Promise.resolve().then(function () { return require('@ionic/cli-utils/lib/ionic-angular/generate'); });
            yield generate({ env: this.env, inputs, options });
            this.env.log.ok(`Generated a ${chalk.bold(type)}${type === 'tabs' ? ' page' : ''} named ${chalk.bold(name)}!`);
        });
    }
};
GenerateCommand = tslib_1.__decorate([
    command_1.CommandMetadata({
        name: 'generate',
        type: 'project',
        description: `Generate pipes, components, pages, directives, providers, and tabs ${chalk.bold(`(ionic-angular >= 3.0.0)`)}`,
        longDescription: `
Automatically create components for your Ionic app.

The given ${chalk.green('name')} is normalized into an appropriate naming convention. For example, ${chalk.green('ionic generate page neat')} creates a page by the name of ${chalk.green('NeatPage')} in ${chalk.green('src/pages/neat/')}.
  `,
        exampleCommands: [
            '',
            ...TYPE_CHOICES,
            'component foo',
            'page Login',
            'page Detail --no-module',
            'page About --constants',
            'pipe MyFilterPipe'
        ],
        inputs: [
            {
                name: 'type',
                description: `The type of generator (e.g. ${TYPE_CHOICES.map(t => chalk.green(t)).join(', ')})`,
                validators: [validators_1.contains(TYPE_CHOICES, {})],
            },
            {
                name: 'name',
                description: 'The name of the component being generated',
            }
        ],
        options: [
            {
                name: 'module',
                description: 'Do not generate an NgModule for the component',
                type: Boolean,
                default: true
            },
            {
                name: 'constants',
                description: 'Generate a page constant file for lazy-loaded pages',
                type: Boolean,
                default: false
            }
        ]
    })
], GenerateCommand);
exports.GenerateCommand = GenerateCommand;
