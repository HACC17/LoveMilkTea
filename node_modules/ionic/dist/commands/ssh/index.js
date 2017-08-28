"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const namespace_1 = require("@ionic/cli-utils/lib/namespace");
class SSHNamespace extends namespace_1.Namespace {
    constructor() {
        super(...arguments);
        this.name = 'ssh';
        this.description = 'Commands for configuring SSH keys';
        this.commands = new namespace_1.CommandMap([
            ['generate', () => tslib_1.__awaiter(this, void 0, void 0, function* () { const { SSHGenerateCommand } = yield Promise.resolve().then(function () { return require('./generate'); }); return new SSHGenerateCommand(); })],
            ['use', () => tslib_1.__awaiter(this, void 0, void 0, function* () { const { SSHUseCommand } = yield Promise.resolve().then(function () { return require('./use'); }); return new SSHUseCommand(); })],
            ['add', () => tslib_1.__awaiter(this, void 0, void 0, function* () { const { SSHAddCommand } = yield Promise.resolve().then(function () { return require('./add'); }); return new SSHAddCommand(); })],
            ['delete', () => tslib_1.__awaiter(this, void 0, void 0, function* () { const { SSHDeleteCommand } = yield Promise.resolve().then(function () { return require('./delete'); }); return new SSHDeleteCommand(); })],
            ['list', () => tslib_1.__awaiter(this, void 0, void 0, function* () { const { SSHListCommand } = yield Promise.resolve().then(function () { return require('./list'); }); return new SSHListCommand(); })],
            ['setup', () => tslib_1.__awaiter(this, void 0, void 0, function* () { const { SSHSetupCommand } = yield Promise.resolve().then(function () { return require('./setup'); }); return new SSHSetupCommand(); })],
            ['ls', 'list'],
            ['remove', 'delete'],
            ['rm', 'delete'],
        ]);
    }
}
exports.SSHNamespace = SSHNamespace;
