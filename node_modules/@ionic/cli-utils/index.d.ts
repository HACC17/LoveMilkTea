import { IHookEngine, IonicEnvironment, RootPlugin } from './definitions';
export * from './definitions';
export { BACKEND_LEGACY, BACKEND_PRO } from './lib/backends';
export declare function registerHooks(hooks: IHookEngine): void;
export declare function generateIonicEnvironment(plugin: RootPlugin, pargv: string[], env: {
    [key: string]: string;
}): Promise<IonicEnvironment>;
