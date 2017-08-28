import { IonicEnvironment } from '../../definitions';
export declare function build({env, options}: {
    env: IonicEnvironment;
    options: {
        _: string[];
        [key: string]: any;
    };
}): Promise<void>;
export declare function buildOptionsToAppScriptsArgs(options: {
    _: string[];
    [key: string]: any;
}): Promise<string[]>;
