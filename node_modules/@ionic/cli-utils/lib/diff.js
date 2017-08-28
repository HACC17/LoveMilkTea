"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk = require("chalk");
function diffPatch(filename, text1, text2) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const JsDiff = yield Promise.resolve().then(function () { return require('diff'); });
        return JsDiff.createPatch(filename, text1, text2, '', '').split('\n').map((line) => {
            if (line.indexOf('-') === 0 && line.indexOf('---') !== 0) {
                line = chalk.bold(chalk.red(line));
            }
            else if (line.indexOf('+') === 0 && line.indexOf('+++') !== 0) {
                line = chalk.bold(chalk.green(line));
            }
            return line;
        }).slice(2).join('\n');
    });
}
exports.diffPatch = diffPatch;
