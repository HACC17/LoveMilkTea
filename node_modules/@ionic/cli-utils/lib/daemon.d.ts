import { DaemonFile, DistTag, IonicEnvironment } from '../definitions';
import { BaseConfig } from './config';
export declare const DAEMON_PID_FILE = "daemon.pid";
export declare const DAEMON_JSON_FILE = "daemon.json";
export declare const DAEMON_LOG_FILE = "daemon.log";
export declare class Daemon extends BaseConfig<DaemonFile> {
    readonly pidFilePath: string;
    readonly logFilePath: string;
    getPid(): Promise<number | undefined>;
    setPid(pid: number): Promise<void>;
    provideDefaults(o: any): Promise<DaemonFile>;
    populateDistTag(distTag: DistTag): void;
    is(j: any): j is DaemonFile;
}
export declare function processRunning(pid: number): boolean;
export declare function checkForDaemon(env: IonicEnvironment): Promise<number>;
