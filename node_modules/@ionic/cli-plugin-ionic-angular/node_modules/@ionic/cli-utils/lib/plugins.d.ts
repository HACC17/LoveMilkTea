import { DistTag, IonicEnvironment, Plugin } from '../definitions';
import { PkgManagerOptions } from './utils/npm';
export declare const KNOWN_COMMAND_PLUGINS: string[];
export declare const KNOWN_GLOBAL_PLUGINS: string[];
export declare const KNOWN_PROJECT_PLUGINS: string[];
export declare const ORG_PREFIX = "@ionic";
export declare const PLUGIN_PREFIX = "cli-plugin-";
export declare const ERROR_PLUGIN_NOT_INSTALLED = "PLUGIN_NOT_INSTALLED";
export declare const ERROR_PLUGIN_NOT_FOUND = "PLUGIN_NOT_FOUND";
export declare const ERROR_PLUGIN_INVALID = "PLUGIN_INVALID";
export declare function formatFullPluginName(name: string): string;
export declare function promptToInstallProjectPlugin(env: IonicEnvironment, {message}: {
    message?: string;
}): Promise<Plugin | undefined>;
export declare function promptToInstallPlugin(env: IonicEnvironment, pluginName: string, {message, global, reinstall}: {
    message?: string;
    global?: boolean;
    reinstall?: boolean;
}): Promise<Plugin | undefined>;
export declare function registerPlugin(env: IonicEnvironment, plugin: Plugin): void;
export declare function unregisterPlugin(env: IonicEnvironment, plugin: Plugin): void;
export declare function loadPlugins(env: IonicEnvironment): Promise<void>;
export declare function validatePlugins(env: IonicEnvironment): void;
export interface LoadPluginOptions {
    message?: string;
    askToInstall?: boolean;
    reinstall?: boolean;
    global?: boolean;
}
export declare function loadPlugin(env: IonicEnvironment, pluginName: string, {message, askToInstall, reinstall, global}: LoadPluginOptions): Promise<Plugin>;
export declare function pluginHasUpdate(currentVersion: string, latestVersion: string): Promise<boolean>;
export declare function checkForUpdates(env: IonicEnvironment): Promise<string[]>;
export declare function pkgInstallPluginArgs(env: IonicEnvironment, name: string, options?: PkgManagerOptions): Promise<string[]>;
export declare function determineDistTag(version: string): DistTag;
