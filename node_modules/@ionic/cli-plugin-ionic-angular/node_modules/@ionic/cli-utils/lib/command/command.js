"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk = require("chalk");
const guards_1 = require("../../guards");
const errors_1 = require("../errors");
const validators_1 = require("../validators");
const utils_1 = require("./utils");
class Command {
    run(inputs, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () { });
    }
    runwrap(fn, opts = {}) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (typeof opts.exit0 === 'undefined') {
                opts.exit0 = true;
            }
            const r = yield fn();
            if (typeof r === 'number' && (r > 0 || (r === 0 && opts.exit0))) {
                throw this.exit('', r);
            }
        });
    }
    runcmd(pargv, opts = {}) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.runwrap(() => tslib_1.__awaiter(this, void 0, void 0, function* () {
                yield this.env.runcmd(pargv, opts);
            }), { exit0: false });
        });
    }
    validate(inputs) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            utils_1.validateInputs(inputs, this.metadata);
        });
    }
    execute(inputs, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const config = yield this.env.config.load();
            yield this.runwrap(() => tslib_1.__awaiter(this, void 0, void 0, function* () {
                if (guards_1.isCommandPreRun(this)) {
                    return this.preRun(inputs, options);
                }
            }));
            if (this.metadata.inputs) {
                for (let input of this.metadata.inputs) {
                    if (!input.validators) {
                        input.validators = [];
                    }
                    if (input.required !== false) {
                        input.validators.unshift(validators_1.validators.required);
                    }
                }
                try {
                    // Validate inputs again, this time with required validator (prompt input
                    // should've happened in preRun)
                    utils_1.validateInputs(inputs, this.metadata);
                }
                catch (e) {
                    if (!this.env.flags.interactive) {
                        this.env.log.warn(`Command ran non-interactively due to ${chalk.green('--no-interactive')} (or CI detected).`);
                    }
                    throw e;
                }
            }
            const runPromise = (() => tslib_1.__awaiter(this, void 0, void 0, function* () {
                yield this.runwrap(() => this.run(inputs, options));
            }))();
            const telemetryPromise = (() => tslib_1.__awaiter(this, void 0, void 0, function* () {
                if (config.telemetry !== false) {
                    let cmdInputs = [];
                    if (this.metadata.name === 'login' || this.metadata.name === 'logout') {
                        yield runPromise;
                    }
                    else if (this.metadata.name === 'help') {
                        cmdInputs = inputs;
                    }
                    else {
                        cmdInputs = yield this.getCleanInputsForTelemetry(inputs, options);
                    }
                    yield this.env.telemetry.sendCommand(`ionic ${this.metadata.fullName}`, cmdInputs);
                }
            }))();
            yield Promise.all([runPromise, telemetryPromise]);
        });
    }
    exit(msg, code = 1) {
        return new errors_1.FatalException(msg, code);
    }
    getCleanInputsForTelemetry(inputs, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const initialOptions = { _: [] };
            const filteredInputs = inputs.filter((input, i) => !this.metadata.inputs || (this.metadata.inputs[i] && !this.metadata.inputs[i].private));
            const filteredOptions = Object.keys(options)
                .filter(optionName => {
                const metadataOption = this.metadata.options && this.metadata.options.find((o) => {
                    return o.name === optionName || (typeof o.aliases !== 'undefined' && o.aliases.includes(optionName));
                });
                if (metadataOption && metadataOption.aliases && metadataOption.aliases.includes(optionName)) {
                    return false; // exclude aliases
                }
                if (!metadataOption) {
                    return true; // include unknown options
                }
                if (metadataOption.private) {
                    return false; // exclude private options
                }
                if (typeof metadataOption.default !== 'undefined' && metadataOption.default === options[optionName]) {
                    return false; // exclude options that match their default value (means it wasn't supplied by user)
                }
                return true;
            })
                .reduce((allOptions, optionName) => {
                allOptions[optionName] = options[optionName];
                return allOptions;
            }, initialOptions);
            const optionInputs = utils_1.minimistOptionsToArray(filteredOptions, { useDoubleQuotes: true });
            return filteredInputs.concat(optionInputs);
        });
    }
}
exports.Command = Command;
