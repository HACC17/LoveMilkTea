"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk = require("chalk");
const cli_utils_1 = require("@ionic/cli-utils");
const modules_1 = require("./lib/modules");
function build(args) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const appScriptsArgs = cli_utils_1.minimistOptionsToArray(args.options, { useEquals: false, ignoreFalse: true, allowCamelCase: true });
        process.argv = ['node', 'appscripts'].concat(appScriptsArgs);
        const AppScripts = modules_1.load('@ionic/app-scripts');
        const context = AppScripts.generateContext();
        console.log(`Running app-scripts build: ${chalk.bold(appScriptsArgs.join(' '))}\n`);
        return yield AppScripts.build(context);
    });
}
exports.build = build;
