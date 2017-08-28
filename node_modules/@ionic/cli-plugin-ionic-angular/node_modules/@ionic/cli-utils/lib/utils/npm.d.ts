import { BowerJson, DistTag, IShellRunOptions, IonicEnvironment, PackageJson } from '../../definitions';
export declare const ERROR_INVALID_PACKAGE_JSON = "INVALID_PACKAGE_JSON";
export declare const ERROR_INVALID_BOWER_JSON = "INVALID_BOWER_JSON";
/**
 * Lightweight version of https://github.com/npm/validate-npm-package-name
 */
export declare function isValidPackageName(name: string): boolean;
export declare function readPackageJsonFile(path: string): Promise<PackageJson>;
export declare function readBowerJsonFile(path: string): Promise<BowerJson>;
export interface PkgManagerOptions extends IShellRunOptions {
    command?: 'dedupe' | 'install' | 'uninstall';
    pkg?: string;
    global?: boolean;
    link?: boolean;
    save?: boolean;
    saveDev?: boolean;
    saveExact?: boolean;
}
/**
 * Resolves pkg manager intent with command args.
 *
 * @return Promise<args> If the args is an empty array, it means the pkg manager doesn't have that command.
 */
export declare function pkgManagerArgs(env: IonicEnvironment, options?: PkgManagerOptions): Promise<string[]>;
export declare function pkgLatestVersion(env: IonicEnvironment, pkg: string, distTag?: DistTag): Promise<string | undefined>;
