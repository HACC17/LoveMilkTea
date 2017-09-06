"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk = require("chalk");
const stringWidth = require("string-width");
const guards_1 = require("../guards");
const backends_1 = require("./backends");
const format_1 = require("./utils/format");
const HELP_DOTS_WIDTH = 25;
function showHelp(env, inputs) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        let code = 0;
        // If there are no inputs then show global command details.
        if (inputs.length === 0) {
            return env.log.msg(yield getFormattedHelpDetails(env, env.namespace, inputs));
        }
        const [, slicedInputs, cmdOrNamespace] = env.namespace.locate(inputs);
        if (!guards_1.isCommand(cmdOrNamespace)) {
            let extra = '';
            if (!env.project.directory) {
                extra = '\nYou may need to be in an Ionic project directory.';
            }
            if (slicedInputs.length > 0) {
                env.log.error(`Unable to find command: ${chalk.green(inputs.join(' '))}${extra}\n`);
                code = 1;
            }
        }
        env.log.msg(yield formatHelp(env, cmdOrNamespace, inputs));
        return code;
    });
}
exports.showHelp = showHelp;
function formatHelp(env, cmdOrNamespace, inputs) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        // If the command is located on the global namespace then show its help
        if (!guards_1.isCommand(cmdOrNamespace)) {
            return getFormattedHelpDetails(env, cmdOrNamespace, inputs);
        }
        const command = cmdOrNamespace;
        return formatCommandHelp(env, command.metadata);
    });
}
function getFormattedHelpDetails(env, ns, inputs) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const globalMetadata = ns.getCommandMetadataList();
        const formatList = (details) => details.map(hd => `    ${hd}\n`).join('');
        if (ns.root) {
            const globalCommandDetails = yield getHelpDetails(env, globalMetadata, [cmd => cmd.type === 'global']);
            const projectCommandDetails = yield getHelpDetails(env, globalMetadata, [cmd => cmd.type === 'project']);
            return `${yield formatHeader(env)}\n\n` +
                `  ${chalk.bold('Usage')}:\n\n` +
                `${yield formatUsage(env)}\n` +
                `  ${chalk.bold('Global Commands')}:\n\n` +
                `${formatList(globalCommandDetails)}\n` +
                `  ${chalk.bold('Project Commands')}:\n\n` +
                `${env.project.directory ? formatList(projectCommandDetails) : '    You are not in a project directory.\n'}\n`;
        }
        else {
            const commandDetails = yield getHelpDetails(env, globalMetadata, []);
            return `\n  ${chalk.bold('Commands')}:\n\n` +
                `${formatList(commandDetails)}\n`;
        }
    });
}
function formatUsage(env) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const options = ['--help', '--verbose', '--quiet', '--no-interactive', '--confirm'];
        const usageLines = [
            `<command> ${chalk.dim('[<args>]')} ${options.map(opt => chalk.dim('[' + opt + ']')).join(' ')} ${chalk.dim('[options]')}`,
        ];
        return usageLines.map(u => `    ${chalk.dim('$')} ${chalk.green('ionic ' + u)}`).join('\n') + '\n';
    });
}
function formatHeader(env) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const config = yield env.config.load();
        const isLoggedIn = yield env.session.isLoggedIn();
        return `   _             _
  (_)           (_)
   _  ___  _ __  _  ___
  | |/ _ \\| '_ \\| |/ __|
  | | (_) | | | | | (__
  |_|\\___/|_| |_|_|\\___|  CLI ${config.backend === backends_1.BACKEND_PRO && isLoggedIn ? chalk.blue('PRO') + ' ' : ''}${env.plugins.ionic.version}\n`;
    });
}
function getHelpDetails(env, commandMetadataList, filters = []) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const config = yield env.config.load();
        for (let f of filters) {
            commandMetadataList = commandMetadataList.filter(f);
        }
        const foundCommandList = commandMetadataList.filter((cmd) => cmd.visible !== false && (!cmd.backends || cmd.backends.includes(config.backend)));
        return getListOfCommandDetails(foundCommandList);
    });
}
function formatCommandHelp(env, cmdMetadata) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (!cmdMetadata.fullName) {
            cmdMetadata.fullName = cmdMetadata.name;
        }
        const displayCmd = 'ionic ' + cmdMetadata.fullName;
        const wrappedDescription = format_1.wordWrap(cmdMetadata.description, { indentation: displayCmd.length + 5 });
        return `
  ${chalk.bold(chalk.green(displayCmd) + ' - ' + wrappedDescription)}${formatLongDescription(cmdMetadata.longDescription)}
  ` +
            (yield formatCommandUsage(env, cmdMetadata)) +
            (yield formatCommandInputs(env, cmdMetadata.inputs)) +
            (yield formatCommandOptions(env, cmdMetadata.options)) +
            (yield formatCommandExamples(env, cmdMetadata.exampleCommands, cmdMetadata.fullName));
    });
}
function getListOfCommandDetails(cmdMetadataList) {
    const fillStringArray = format_1.generateFillSpaceStringList(cmdMetadataList.map(cmdMd => cmdMd.fullName || cmdMd.name), HELP_DOTS_WIDTH, chalk.dim('.'));
    return cmdMetadataList.map((cmdMd, index) => {
        const description = cmdMd.description + `${cmdMd.aliases && cmdMd.aliases.length > 0 ? chalk.dim(' (alias' + (cmdMd.aliases.length === 1 ? '' : 'es') + ': ') + cmdMd.aliases.map((a) => chalk.green(a)).join(', ') + chalk.dim(')') : ''}`;
        const wrappedDescription = format_1.wordWrap(description, { indentation: HELP_DOTS_WIDTH + 6 });
        return `${chalk.green(cmdMd.fullName || '')} ${fillStringArray[index]} ${wrappedDescription}`;
    });
}
function formatCommandUsage(env, cmdMetadata) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const formatInput = (input) => {
            if (!env.flags.interactive && input.required !== false) {
                return '<' + input.name + '>';
            }
            return '[<' + input.name + '>]';
        };
        const options = yield filterOptionsForHelp(env, cmdMetadata.options);
        const usageLine = `${chalk.dim('$')} ${chalk.green('ionic ' + cmdMetadata.name + (typeof cmdMetadata.inputs === 'undefined' ? '' : ' ' + cmdMetadata.inputs.map(formatInput).join(' ')))} ${options.length > 0 ? chalk.green('[options]') : ''}`;
        return `
  ${chalk.bold('Usage')}:

    ${usageLine}
  `;
    });
}
function formatLongDescription(longDescription) {
    if (!longDescription) {
        return '';
    }
    longDescription = longDescription.trim();
    longDescription = format_1.wordWrap(longDescription, { indentation: 4 });
    return '\n\n    ' + longDescription;
}
function formatCommandInputs(env, inputs = []) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (inputs.length === 0) {
            return '';
        }
        const fillStrings = format_1.generateFillSpaceStringList(inputs.map(input => input.name), HELP_DOTS_WIDTH, chalk.dim('.'));
        function inputLineFn({ name, description }, index) {
            const optionList = chalk.green(`${name}`);
            const wrappedDescription = format_1.wordWrap(description, { indentation: HELP_DOTS_WIDTH + 6 });
            return `${optionList} ${fillStrings[index]} ${wrappedDescription}`;
        }
        return `
  ${chalk.bold('Inputs')}:

    ${inputs.map(inputLineFn).join(`
    `)}
  `;
    });
}
function formatOptionDefault(opt) {
    if (typeof opt.default === 'string') {
        return chalk.dim(' (default: ') + chalk.green(opt.default) + chalk.dim(')');
    }
    else {
        return '';
    }
}
function formatOptionLine(opt) {
    const showInverse = opt.type === Boolean && opt.default === true && opt.name.length > 1;
    const optionList = (showInverse ? chalk.green(`--no-${opt.name}`) : chalk.green(`-${opt.name.length > 1 ? '-' : ''}${opt.name}`)) +
        (!showInverse && opt.aliases && opt.aliases.length > 0 ? ', ' +
            opt.aliases
                .map((alias) => chalk.green(`-${alias}`))
                .join(', ') : '');
    const optionListLength = stringWidth(optionList);
    const fullLength = optionListLength > HELP_DOTS_WIDTH ? optionListLength + 1 : HELP_DOTS_WIDTH;
    const wrappedDescription = format_1.wordWrap(opt.description + formatOptionDefault(opt), { indentation: HELP_DOTS_WIDTH + 6 });
    return `${optionList} ${Array(fullLength - optionListLength).fill(chalk.dim('.')).join('')} ${wrappedDescription}`;
}
function filterOptionsForHelp(env, options = []) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const config = yield env.config.load();
        return options.filter(opt => opt.visible !== false && (!opt.backends || opt.backends.includes(config.backend)));
    });
}
function formatCommandOptions(env, options = []) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        options = yield filterOptionsForHelp(env, options);
        if (options.length === 0) {
            return '';
        }
        return `
  ${chalk.bold('Options')}:

    ${options.map(formatOptionLine).join(`
    `)}
  `;
    });
}
function formatCommandExamples(env, exampleCommands, commandName) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (!Array.isArray(exampleCommands)) {
            return '';
        }
        const exampleLines = exampleCommands.map(cmd => {
            const sepIndex = cmd.indexOf(' -- ');
            if (sepIndex === -1) {
                cmd = chalk.green(cmd);
            }
            else {
                cmd = chalk.green(cmd.substring(0, sepIndex)) + cmd.substring(sepIndex);
            }
            const wrappedCmd = format_1.wordWrap(cmd, { indentation: 12, append: ' \\' });
            return `${chalk.dim('$')} ${chalk.green('ionic ' + commandName)} ${wrappedCmd}`;
        });
        return `
  ${chalk.bold('Examples')}:

    ${exampleLines.join(`
    `)}
  `;
    });
}
