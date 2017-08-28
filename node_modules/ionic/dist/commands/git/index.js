"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const namespace_1 = require("@ionic/cli-utils/lib/namespace");
class GitNamespace extends namespace_1.Namespace {
    constructor() {
        super(...arguments);
        this.name = 'git';
        this.description = 'Commands relating to git';
        this.commands = new namespace_1.CommandMap([
            ['clone', () => tslib_1.__awaiter(this, void 0, void 0, function* () { const { GitCloneCommand } = yield Promise.resolve().then(function () { return require('./clone'); }); return new GitCloneCommand(); })],
            ['remote', () => tslib_1.__awaiter(this, void 0, void 0, function* () { const { GitRemoteCommand } = yield Promise.resolve().then(function () { return require('./remote'); }); return new GitRemoteCommand(); })],
        ]);
    }
}
exports.GitNamespace = GitNamespace;
