import { IHook, IHookEngine } from '../definitions';
export declare class Hook<T, U> implements IHook<T, U> {
    source: string;
    name: string;
    protected callable: (args: T) => Promise<U>;
    constructor(source: string, name: string, callable: (args: T) => Promise<U>);
    fire(args: T): Promise<U>;
}
export declare class HookEngine implements IHookEngine {
    private hooks;
    register<T, U>(source: string, hook: string, listener: (args: T) => Promise<U>): void;
    fire<T, U>(hook: string, args: T): Promise<U[]>;
    getSources(hook: string): string[];
    hasSources(hook: string, sources: string[]): boolean;
    deleteSource(source: string): void;
    getRegistered<T, U>(hook: string): IHook<T, U>[];
}
