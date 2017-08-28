import { IHookEngine } from '@ionic/cli-utils';
import { CordovaNamespace } from './commands';
export declare const name = "__NAME__";
export declare const version = "__VERSION__";
export declare const namespace: CordovaNamespace;
export declare function registerHooks(hooks: IHookEngine): void;
