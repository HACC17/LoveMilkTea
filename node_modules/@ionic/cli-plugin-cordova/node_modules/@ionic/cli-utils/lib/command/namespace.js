"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const string_1 = require("../utils/string");
class CommandMap extends Map {
    getAliases() {
        const cmdAliases = new Map();
        const cmdMapContents = Array.from(this.entries());
        const aliasToCmd = cmdMapContents.filter((value) => typeof value[1] === 'string'); // TODO: typescript bug?
        aliasToCmd.forEach(([alias, cmd]) => {
            const aliases = cmdAliases.get(cmd) || [];
            aliases.push(alias);
            cmdAliases.set(cmd, aliases);
        });
        return cmdAliases;
    }
    resolveAliases(cmdName) {
        const r = this.get(cmdName);
        if (typeof r !== 'string') {
            return r;
        }
        return this.resolveAliases(r);
    }
}
exports.CommandMap = CommandMap;
class NamespaceMap extends Map {
}
exports.NamespaceMap = NamespaceMap;
class Namespace {
    constructor() {
        this.root = false;
        this.name = '';
        this.namespaces = new NamespaceMap();
        this.commands = new CommandMap();
        this.source = '';
    }
    /**
     * Recursively inspect inputs supplied to walk down all the tree of
     * namespaces available to find the command that we will execute or the
     * right-most namespace matched if the command is not found.
     */
    locate(argv) {
        function _locate(depth, inputs, ns, namespaceDepthList) {
            const nsgetter = ns.namespaces.get(inputs[0]);
            if (!nsgetter) {
                const commands = ns.commands;
                const cmdgetter = commands.resolveAliases(inputs[0]);
                if (cmdgetter) {
                    const cmd = cmdgetter();
                    cmd.metadata.source = ns.source;
                    cmd.metadata.fullName = [...namespaceDepthList.slice(1), cmd.metadata.name].join(' ');
                    return [depth + 1, inputs.slice(1), cmd];
                }
                return [depth, inputs, ns];
            }
            const newNamespace = nsgetter();
            return _locate(depth + 1, inputs.slice(1), newNamespace, [...namespaceDepthList, newNamespace.name]);
        }
        return _locate(0, argv, this, [this.name]);
    }
    /**
     * Get all command metadata in a flat structure.
     */
    getCommandMetadataList() {
        function _getCommandMetadataList(namespace, namespaceDepthList) {
            const commandList = [];
            const aliases = namespace.commands.getAliases();
            // Gather all commands for a namespace and turn them into simple key value
            // objects. Also keep a record of the namespace path.
            namespace.commands.forEach((cmdgetter) => {
                if (typeof cmdgetter === 'string') {
                    return;
                }
                const cmd = cmdgetter();
                cmd.metadata.source = namespace.source;
                cmd.metadata.fullName = [...namespaceDepthList.slice(1), cmd.metadata.name].join(' ');
                cmd.metadata.aliases = aliases.get(cmd.metadata.name) || [];
                commandList.push(cmd.metadata);
            });
            commandList.sort((a, b) => string_1.strcmp(a.name, b.name));
            let namespacedCommandList = [];
            // If this namespace has children then get their commands
            if (namespace.namespaces.size > 0) {
                namespace.namespaces.forEach((nsgetter) => {
                    const ns = nsgetter();
                    const cmds = _getCommandMetadataList(ns, [...namespaceDepthList, ns.name]);
                    namespacedCommandList = namespacedCommandList.concat(cmds);
                });
            }
            namespacedCommandList.sort((a, b) => string_1.strcmp(a.fullName, b.fullName));
            return commandList.concat(namespacedCommandList);
        }
        return _getCommandMetadataList(this, [this.name]);
    }
}
exports.Namespace = Namespace;
