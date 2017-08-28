import { DistTag, IonicEnvironment, Plugin, PluginMeta } from '../definitions';
import { PkgManagerOptions } from './utils/npm';
export declare const ERROR_PLUGIN_NOT_INSTALLED = "PLUGIN_NOT_INSTALLED";
export declare const ERROR_PLUGIN_NOT_FOUND = "PLUGIN_NOT_FOUND";
export declare const ERROR_PLUGIN_INVALID = "PLUGIN_INVALID";
export declare const KNOWN_PLUGINS: string[];
export declare function formatFullPluginName(name: string): string;
export declare function promptToInstallPlugin(env: IonicEnvironment, pluginName: string, {message, global, reinstall}: {
    message?: string;
    global?: boolean;
    reinstall?: boolean;
}): Promise<Plugin | undefined>;
export declare function registerPlugin(env: IonicEnvironment, plugin: Plugin): void;
export declare function unregisterPlugin(env: IonicEnvironment, plugin: Plugin): void;
export declare function loadPlugins(env: IonicEnvironment): Promise<void>;
export interface LoadPluginOptions {
    message?: string;
    askToInstall?: boolean;
    reinstall?: boolean;
    global?: boolean;
}
export declare function loadPlugin(env: IonicEnvironment, pluginName: string, {message, askToInstall, reinstall, global}: LoadPluginOptions): Promise<Plugin>;
export declare function getPluginMeta(p: string): Promise<PluginMeta>;
export declare function versionNeedsUpdating(version: string, latestVersion: string): Promise<boolean>;
export declare function checkForUpdates(env: IonicEnvironment): Promise<string[]>;
export declare function getLatestPluginVersion(env: IonicEnvironment, name: string, version: string): Promise<string | undefined>;
export declare function pkgInstallPluginArgs(env: IonicEnvironment, name: string, options?: PkgManagerOptions): Promise<string[]>;
export declare function determineDistTag(version: string): DistTag;
