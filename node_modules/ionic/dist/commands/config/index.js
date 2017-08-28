"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const namespace_1 = require("@ionic/cli-utils/lib/namespace");
class ConfigNamespace extends namespace_1.Namespace {
    constructor() {
        super(...arguments);
        this.name = 'config';
        this.description = 'Manage CLI and project config values';
        this.commands = new namespace_1.CommandMap([
            ['get', () => tslib_1.__awaiter(this, void 0, void 0, function* () { const { ConfigGetCommand } = yield Promise.resolve().then(function () { return require('./get'); }); return new ConfigGetCommand(); })],
            ['set', () => tslib_1.__awaiter(this, void 0, void 0, function* () { const { ConfigSetCommand } = yield Promise.resolve().then(function () { return require('./set'); }); return new ConfigSetCommand(); })],
        ]);
    }
}
exports.ConfigNamespace = ConfigNamespace;
