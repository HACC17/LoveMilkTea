import * as gulpType from 'gulp';
import { IonicEnvironment } from '../definitions';
export declare function loadGulp(env: IonicEnvironment): Promise<typeof gulpType>;
export declare function getGulpVersion(): Promise<string | undefined>;
export declare function checkGulp(env: IonicEnvironment): Promise<void>;
export declare function runTask(env: IonicEnvironment, name: string): Promise<void>;
export declare function registerWatchEvents(env: IonicEnvironment): Promise<void>;
