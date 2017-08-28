import { IonicEnvironment } from '../../definitions';
export declare function getIonicAngularVersion(env: IonicEnvironment): Promise<string | undefined>;
export declare function getAppScriptsVersion(env: IonicEnvironment): Promise<string | undefined>;
export declare function importAppScripts(env: IonicEnvironment): Promise<any>;
