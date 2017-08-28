"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk = require("chalk");
const path = require("path");
const cli_utils_1 = require("@ionic/cli-utils");
const modules_1 = require("./lib/modules");
const generate_1 = require("./utils/generate");
function generate(args) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (!args.env.project.directory) {
            return [];
        }
        const appScriptsArgs = cli_utils_1.minimistOptionsToArray(args.options, { useEquals: false, ignoreFalse: true, allowCamelCase: true });
        process.argv = ['node', 'appscripts'].concat(appScriptsArgs);
        const ionicAngularPackageJsonFilePath = path.resolve(args.env.project.directory, 'node_modules', 'ionic-angular', 'package.json'); // TODO
        try {
            const ionicAngularPackageJson = yield cli_utils_1.readPackageJsonFile(ionicAngularPackageJsonFilePath);
            if (ionicAngularPackageJson.version && Number(ionicAngularPackageJson.version.charAt(0)) < 3) {
                throw new Error(`The generate command is only available for projects that use ionic-angular >= 3.0.0`);
            }
        }
        catch (e) {
            args.env.log.error(`Error with ${chalk.bold(cli_utils_1.prettyPath(ionicAngularPackageJsonFilePath))} file: ${e}`);
        }
        const AppScripts = modules_1.load('@ionic/app-scripts');
        const context = AppScripts.generateContext();
        const [type, name] = args.inputs;
        const commandOptions = {
            module: false,
            constants: false,
        };
        if (args.options['module']) {
            commandOptions.module = true;
        }
        if (args.options['constants']) {
            commandOptions.constants = true;
        }
        switch (type) {
            case 'page':
                yield AppScripts.processPageRequest(context, name, commandOptions);
                break;
            case 'component':
                const componentData = yield generate_1.getModules(context, 'component');
                yield AppScripts.processComponentRequest(context, name, componentData);
                break;
            case 'directive':
                const directiveData = yield generate_1.getModules(context, 'directive');
                yield AppScripts.processDirectiveRequest(context, name, directiveData);
                break;
            case 'pipe':
                const pipeData = yield generate_1.getModules(context, 'pipe');
                yield AppScripts.processPipeRequest(context, name, pipeData);
                break;
            case 'provider':
                const providerData = yield promptQuestions(context);
                yield AppScripts.processProviderRequest(context, name, providerData);
                break;
            case 'tabs':
                const tabsData = yield generate_1.tabsPrompt(args.env);
                yield AppScripts.processTabsRequest(context, name, tabsData, commandOptions);
                break;
        }
        return [];
    });
}
exports.generate = generate;
function promptQuestions(context) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return yield generate_1.prompt(context);
    });
}
