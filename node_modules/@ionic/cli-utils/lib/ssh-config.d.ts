import * as SSHConfigModule from 'ssh-config';
export declare const SSHConfig: typeof SSHConfigModule;
export declare function loadFromPath(p: string): Promise<SSHConfigModule.SSHConfig>;
export declare function isDirective(entry: SSHConfigModule.Config): entry is SSHConfigModule.ConfigDirective;
export declare function getConfigPath(): string;
export declare function findHostSection(conf: SSHConfigModule.SSHConfig, host: string): SSHConfigModule.ConfigDirective | null;
export declare function ensureHostAndKeyPath(conf: SSHConfigModule.SSHConfig, conn: {
    host: string;
    port?: number;
}, keyPath: string): void;
export declare function ensureSection(conf: SSHConfigModule.SSHConfig, host: string, newline: boolean): SSHConfigModule.ConfigDirective;
export declare function ensureSectionLine(section: SSHConfigModule.ConfigDirective, key: string, value: string): void;
