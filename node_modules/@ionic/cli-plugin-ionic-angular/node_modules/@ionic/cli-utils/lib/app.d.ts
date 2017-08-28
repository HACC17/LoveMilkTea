import { AppDetails, IApp, IClient } from '../definitions';
export declare class App implements IApp {
    protected appUserToken: string;
    protected client: IClient;
    constructor(appUserToken: string, client: IClient);
    load(app_id: string): Promise<AppDetails>;
}
