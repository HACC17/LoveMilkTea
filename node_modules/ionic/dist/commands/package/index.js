"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const namespace_1 = require("@ionic/cli-utils/lib/namespace");
class PackageNamespace extends namespace_1.Namespace {
    constructor() {
        super(...arguments);
        this.name = 'package';
        this.description = 'Commands for Ionic Package';
        this.commands = new namespace_1.CommandMap([
            ['build', () => tslib_1.__awaiter(this, void 0, void 0, function* () { const { PackageBuildCommand } = yield Promise.resolve().then(function () { return require('./build'); }); return new PackageBuildCommand(); })],
            ['download', () => tslib_1.__awaiter(this, void 0, void 0, function* () { const { PackageDownloadCommand } = yield Promise.resolve().then(function () { return require('./download'); }); return new PackageDownloadCommand(); })],
            ['info', () => tslib_1.__awaiter(this, void 0, void 0, function* () { const { PackageInfoCommand } = yield Promise.resolve().then(function () { return require('./info'); }); return new PackageInfoCommand(); })],
            ['list', () => tslib_1.__awaiter(this, void 0, void 0, function* () { const { PackageListCommand } = yield Promise.resolve().then(function () { return require('./list'); }); return new PackageListCommand(); })],
        ]);
    }
}
exports.PackageNamespace = PackageNamespace;
