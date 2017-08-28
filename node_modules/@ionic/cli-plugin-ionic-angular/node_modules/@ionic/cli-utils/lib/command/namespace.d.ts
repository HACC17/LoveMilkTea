import { CommandData, CommandMapGetter, ICommand, INamespace, NamespaceMapGetter } from '../../definitions';
export declare class CommandMap extends Map<string, string | CommandMapGetter> {
    getAliases(): Map<string, string[]>;
    resolveAliases(cmdName: string): undefined | CommandMapGetter;
}
export declare class NamespaceMap extends Map<string, NamespaceMapGetter> {
}
export declare class Namespace implements INamespace {
    root: boolean;
    name: string;
    namespaces: NamespaceMap;
    commands: CommandMap;
    source: string;
    /**
     * Recursively inspect inputs supplied to walk down all the tree of
     * namespaces available to find the command that we will execute or the
     * right-most namespace matched if the command is not found.
     */
    locate(argv: string[]): [number, string[], ICommand | INamespace];
    /**
     * Get all command metadata in a flat structure.
     */
    getCommandMetadataList(): CommandData[];
}
