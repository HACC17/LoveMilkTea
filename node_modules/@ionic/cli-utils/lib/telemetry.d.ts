import * as leekType from 'leek';
import { ConfigFile, IClient, IConfig, IProject, ISession, ITelemetry, RootPlugin } from '../definitions';
export declare class Telemetry implements ITelemetry {
    client: IClient;
    protected config: IConfig<ConfigFile>;
    protected plugin: RootPlugin;
    protected session: ISession;
    protected project: IProject;
    protected gaTracker: leekType;
    constructor({config, client, session, plugin, project}: {
        config: IConfig<ConfigFile>;
        client: IClient;
        session: ISession;
        plugin: RootPlugin;
        project: IProject;
    });
    protected setupGATracker(): Promise<void>;
    resetToken(): Promise<void>;
    sendCommand(command: string, args: string[]): Promise<void>;
    sendError(error: any, type: string): Promise<void>;
}
