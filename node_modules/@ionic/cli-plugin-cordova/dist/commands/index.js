"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cli_utils_1 = require("@ionic/cli-utils");
const build_1 = require("./build");
const compile_1 = require("./compile");
const emulate_1 = require("./emulate");
const platform_1 = require("./platform");
const plugin_1 = require("./plugin");
const prepare_1 = require("./prepare");
const resources_1 = require("./resources");
const run_1 = require("./run");
class CordovaNamespace extends cli_utils_1.Namespace {
    constructor() {
        super(...arguments);
        this.name = 'cordova';
        this.commands = new cli_utils_1.CommandMap([
            ['build', () => new build_1.BuildCommand()],
            ['compile', () => new compile_1.CompileCommand()],
            ['emulate', () => new emulate_1.EmulateCommand()],
            ['platform', () => new platform_1.PlatformCommand()],
            ['plugin', () => new plugin_1.PluginCommand()],
            ['prepare', () => new prepare_1.PrepareCommand()],
            ['resources', () => new resources_1.ResourcesCommand()],
            ['run', () => new run_1.RunCommand()],
        ]);
    }
}
exports.CordovaNamespace = CordovaNamespace;
