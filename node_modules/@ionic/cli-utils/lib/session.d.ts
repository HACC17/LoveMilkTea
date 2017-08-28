import { IClient, IConfig, IProject, ISession, IonicEnvironment } from '../definitions';
export declare class BaseSession {
    protected config: IConfig;
    protected project: IProject;
    protected client: IClient;
    constructor(config: IConfig, project: IProject, client: IClient);
    isLoggedIn(): Promise<boolean>;
    logout(): Promise<void>;
    getUserToken(): Promise<string>;
}
export declare class CloudSession extends BaseSession implements ISession {
    login(email: string, password: string): Promise<void>;
    getAppUserToken(app_id?: string): Promise<string>;
}
export declare class ProSession extends BaseSession implements ISession {
    login(email: string, password: string): Promise<void>;
    getAppUserToken(app_id?: string): Promise<string>;
}
export declare function promptToLogin(env: IonicEnvironment): Promise<void>;
