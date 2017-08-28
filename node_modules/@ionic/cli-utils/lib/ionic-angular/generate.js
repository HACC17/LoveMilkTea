"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const utils_1 = require("./utils");
function generate(args) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const { minimistOptionsToArray } = yield Promise.resolve().then(function () { return require('../utils/command'); });
        if (!args.env.project.directory) {
            return [];
        }
        const appScriptsArgs = minimistOptionsToArray(args.options, { useEquals: false, ignoreFalse: true, allowCamelCase: true });
        process.argv = ['node', 'appscripts'].concat(appScriptsArgs);
        const AppScripts = yield utils_1.importAppScripts(args.env);
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
                const componentData = yield getModules(context, 'component');
                yield AppScripts.processComponentRequest(context, name, componentData);
                break;
            case 'directive':
                const directiveData = yield getModules(context, 'directive');
                yield AppScripts.processDirectiveRequest(context, name, directiveData);
                break;
            case 'pipe':
                const pipeData = yield getModules(context, 'pipe');
                yield AppScripts.processPipeRequest(context, name, pipeData);
                break;
            case 'provider':
                const providerData = yield promptQuestions(context);
                yield AppScripts.processProviderRequest(context, name, providerData);
                break;
            case 'tabs':
                const tabsData = yield tabsPrompt(args.env);
                yield AppScripts.processTabsRequest(context, name, tabsData, commandOptions);
                break;
        }
        return [];
    });
}
exports.generate = generate;
function promptQuestions(context) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return yield prompt(context);
    });
}
// async function getPages(context: any) {
//   const AppScripts = await import('@ionic/app-scripts');
//   const pages = await AppScripts.getNgModules(context, ['page', 'component']);
//   const ngModuleSuffix = await AppScripts.getStringPropertyValue('IONIC_NG_MODULE_FILENAME_SUFFIX');
//   return pages.map((page: any) => {
//     return {
//       fileName: path.basename(page.absolutePath, ngModuleSuffix),
//       absolutePath: page.absolutePath,
//       relativePath: path.relative(context.rootDir, page.absolutePath)
//     };
//   });
// }
function prompt(context) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return context.appNgModulePath;
    });
}
function getModules(context, kind) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        switch (kind) {
            case 'component':
                return context.componentsNgModulePath ? context.componentsNgModulePath : context.appNgModulePath;
            case 'pipe':
                return context.pipesNgModulePath ? context.pipesNgModulePath : context.appNgModulePath;
            case 'directive':
                return context.directivesNgModulePath ? context.directivesNgModulePath : context.appNgModulePath;
        }
    });
}
function tabsPrompt(env) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const { validators } = yield Promise.resolve().then(function () { return require('../validators'); });
        const tabNames = [];
        const howMany = yield env.prompt({
            type: 'input',
            name: 'howMany',
            message: 'How many tabs?',
            validate: v => validators.numeric(v),
        });
        for (let i = 0; i < parseInt(howMany, 10); i++) {
            const tabName = yield env.prompt({
                type: 'input',
                name: 'tabName',
                message: 'Name of this tab:'
            });
            tabNames.push(tabName);
        }
        return tabNames;
    });
}
exports.tabsPrompt = tabsPrompt;
