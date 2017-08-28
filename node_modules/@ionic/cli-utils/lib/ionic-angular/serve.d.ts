import { IonicEnvironment, ServeDetails, ServeOptions } from '../../definitions';
export interface AppScriptsServeOptions extends ServeOptions {
    platform: string;
    target?: string;
    iscordovaserve: boolean;
}
export declare function serve({env, options}: {
    env: IonicEnvironment;
    options: AppScriptsServeOptions;
}): Promise<ServeDetails>;
export declare function serveOptionsToAppScriptsArgs(options: AppScriptsServeOptions): Promise<string[]>;
