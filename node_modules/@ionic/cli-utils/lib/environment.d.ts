import * as inquirerType from 'inquirer';
import { ConfigFile, ICLIEventEmitter, IClient, IConfig, IDaemon, IHookEngine, ILogger, IProject, IRootNamespace, ISession, IShell, ITaskChain, ITelemetry, IonicEnvironment, IonicEnvironmentFlags, IonicEnvironmentMeta, IonicEnvironmentPlugins, PromptModule } from '../definitions';
export declare class Environment implements IonicEnvironment {
    readonly flags: IonicEnvironmentFlags;
    readonly hooks: IHookEngine;
    readonly client: IClient;
    readonly config: IConfig<ConfigFile>;
    readonly daemon: IDaemon;
    readonly events: ICLIEventEmitter;
    readonly log: ILogger;
    readonly prompt: PromptModule;
    readonly meta: IonicEnvironmentMeta;
    project: IProject;
    readonly plugins: IonicEnvironmentPlugins;
    session: ISession;
    readonly shell: IShell;
    readonly tasks: ITaskChain;
    readonly telemetry: ITelemetry;
    readonly namespace: IRootNamespace;
    private bottomBar?;
    constructor({bottomBar, client, config, daemon, events, flags, hooks, log, meta, namespace, plugins, project, prompt, session, shell, tasks, telemetry}: {
        bottomBar?: inquirerType.ui.BottomBar;
        client: IClient;
        config: IConfig<ConfigFile>;
        daemon: IDaemon;
        events: ICLIEventEmitter;
        flags: IonicEnvironmentFlags;
        hooks: IHookEngine;
        log: ILogger;
        meta: IonicEnvironmentMeta;
        namespace: IRootNamespace;
        plugins: IonicEnvironmentPlugins;
        project: IProject;
        prompt: PromptModule;
        session: ISession;
        shell: IShell;
        tasks: ITaskChain;
        telemetry: ITelemetry;
    });
    load(p: any): any;
    open(): Promise<void>;
    close(): Promise<void>;
    runcmd(pargv: string[], opts?: {
        showExecution?: boolean;
        showLogs?: boolean;
    }): Promise<void>;
}
