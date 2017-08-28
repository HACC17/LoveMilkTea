import * as minimistType from 'minimist';
import { ConfigFile, IBaseConfig, IConfig, IonicEnvironment } from '../definitions';
export declare abstract class BaseConfig<T> implements IBaseConfig<T> {
    fileName: string;
    directory: string;
    filePath: string;
    protected configFile?: T;
    protected originalConfigFile?: {
        [key: string]: any;
    };
    constructor(directory: string, fileName: string);
    abstract provideDefaults(o: {
        [key: string]: any;
    }): Promise<T>;
    abstract is(o: any): o is T;
    load(options?: {
        disk?: boolean;
    }): Promise<T>;
    save(configFile?: T): Promise<void>;
}
export declare const CONFIG_FILE = "config.json";
export declare const CONFIG_DIRECTORY: string;
export declare class Config extends BaseConfig<ConfigFile> implements IConfig {
    provideDefaults(o: any): Promise<ConfigFile>;
    is(j: any): j is ConfigFile;
    isUpdatingEnabled(): Promise<boolean>;
}
export declare function gatherFlags(argv: minimistType.ParsedArgs): IonicEnvironment['flags'];
