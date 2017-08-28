"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path = require("path");
const cli_utils_1 = require("@ionic/cli-utils");
const modules_1 = require("../lib/modules");
function getPages(context) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const AppScripts = modules_1.load('@ionic/app-scripts');
        const pages = yield AppScripts.getNgModules(context, ['page', 'component']);
        const ngModuleSuffix = yield AppScripts.getStringPropertyValue('IONIC_NG_MODULE_FILENAME_SUFFIX');
        return pages.map((page) => {
            return {
                fileName: path.basename(page.absolutePath, ngModuleSuffix),
                absolutePath: page.absolutePath,
                relativePath: path.relative(context.rootDir, page.absolutePath)
            };
        });
    });
}
exports.getPages = getPages;
function prompt(context) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return context.appNgModulePath;
    });
}
exports.prompt = prompt;
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
exports.getModules = getModules;
function tabsPrompt(env) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const tabNames = [];
        const howMany = yield env.prompt({
            type: 'input',
            name: 'howMany',
            message: 'How many tabs?',
            validate: v => cli_utils_1.validators.numeric(v),
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
