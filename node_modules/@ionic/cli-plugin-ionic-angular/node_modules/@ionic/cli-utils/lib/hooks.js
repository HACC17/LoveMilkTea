"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
class Hook {
    constructor(source, name, callable) {
        this.source = source;
        this.name = name;
        this.callable = callable;
    }
    fire(args) {
        return this.callable(args);
    }
}
exports.Hook = Hook;
class HookEngine {
    constructor() {
        this.hooks = new Map();
    }
    register(source, hook, listener) {
        const h = new Hook(source, hook, listener);
        this.getRegistered(hook).push(h);
    }
    fire(hook, args) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const registeredHooks = this.hooks.get(hook) || [];
            return Promise.all(registeredHooks.map((h) => h.fire(args)));
        });
    }
    getSources(hook) {
        return [...new Set(this.getRegistered(hook).map(h => h.source))];
    }
    hasSources(hook, sources) {
        return sources.filter(s => this.getSources(hook).includes(s)).length > 0;
    }
    deleteSource(source) {
        for (let [hookName, hooks] of this.hooks.entries()) {
            this.hooks.set(hookName, hooks.filter((h) => h.source !== source));
        }
    }
    getRegistered(hook) {
        let registeredHooks = this.hooks.get(hook);
        if (!registeredHooks) {
            registeredHooks = [];
            this.hooks.set(hook, registeredHooks);
        }
        return registeredHooks;
    }
}
exports.HookEngine = HookEngine;
