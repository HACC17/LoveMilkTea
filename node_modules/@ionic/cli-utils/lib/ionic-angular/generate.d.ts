import { IonicEnvironment } from '../../definitions';
export declare function generate(args: {
    env: IonicEnvironment;
    inputs: string[];
    options: {
        _: string[];
        [key: string]: any;
    };
}): Promise<string[]>;
export declare function tabsPrompt(env: IonicEnvironment): Promise<string[]>;
