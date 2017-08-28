"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk = require("chalk");
function createPromptModule({ interactive, confirm, log, config }) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const inquirer = yield Promise.resolve().then(function () { return require('inquirer'); });
        const inquirerPromptModule = inquirer.createPromptModule();
        function createPrompter(question) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                if (interactive === false) {
                    if (typeof question.noninteractiveValue !== 'undefined') {
                        return question.noninteractiveValue;
                    }
                    if (question.type === 'confirm') {
                        if (confirm) {
                            log.info(`${chalk.green('--confirm')}: ${chalk.dim(question.message)} ${chalk.cyan('Yes')}`);
                            return true;
                        }
                        else {
                            log.info(`${chalk.green('--no-confirm')}: ${chalk.dim(question.message)} ${chalk.cyan('No')}`);
                            return false;
                        }
                    }
                    return '';
                }
                const result = (yield inquirerPromptModule(question))[question.name];
                if (typeof result !== 'string' && typeof result !== 'boolean') {
                    return String(result);
                }
                return result;
            });
        }
        return createPrompter;
    });
}
exports.createPromptModule = createPromptModule;
