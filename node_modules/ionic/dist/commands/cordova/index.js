"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const namespace_1 = require("@ionic/cli-utils/lib/namespace");
class CordovaNamespace extends namespace_1.Namespace {
    constructor() {
        super(...arguments);
        this.name = 'cordova';
        this.description = 'Cordova functionality';
        this.commands = new namespace_1.CommandMap([
            ['build', () => tslib_1.__awaiter(this, void 0, void 0, function* () { const { BuildCommand } = yield Promise.resolve().then(function () { return require('./build'); }); return new BuildCommand(); })],
            ['compile', () => tslib_1.__awaiter(this, void 0, void 0, function* () { const { CompileCommand } = yield Promise.resolve().then(function () { return require('./compile'); }); return new CompileCommand(); })],
            ['emulate', () => tslib_1.__awaiter(this, void 0, void 0, function* () { const { EmulateCommand } = yield Promise.resolve().then(function () { return require('./emulate'); }); return new EmulateCommand(); })],
            ['platform', () => tslib_1.__awaiter(this, void 0, void 0, function* () { const { PlatformCommand } = yield Promise.resolve().then(function () { return require('./platform'); }); return new PlatformCommand(); })],
            ['plugin', () => tslib_1.__awaiter(this, void 0, void 0, function* () { const { PluginCommand } = yield Promise.resolve().then(function () { return require('./plugin'); }); return new PluginCommand(); })],
            ['prepare', () => tslib_1.__awaiter(this, void 0, void 0, function* () { const { PrepareCommand } = yield Promise.resolve().then(function () { return require('./prepare'); }); return new PrepareCommand(); })],
            ['resources', () => tslib_1.__awaiter(this, void 0, void 0, function* () { const { ResourcesCommand } = yield Promise.resolve().then(function () { return require('./resources'); }); return new ResourcesCommand(); })],
            ['run', () => tslib_1.__awaiter(this, void 0, void 0, function* () { const { RunCommand } = yield Promise.resolve().then(function () { return require('./run'); }); return new RunCommand(); })],
        ]);
    }
}
exports.CordovaNamespace = CordovaNamespace;
