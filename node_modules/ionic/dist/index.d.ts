import { IHookEngine } from '@ionic/cli-utils';
import { IonicNamespace } from './commands';
export declare const namespace: IonicNamespace;
export declare function registerHooks(hooks: IHookEngine): void;
export declare function run(pargv: string[], env: {
    [k: string]: string;
}): Promise<void>;
