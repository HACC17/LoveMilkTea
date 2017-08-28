import { IClient, SecurityProfile } from '../definitions';
export declare class SecurityClient {
    protected appUserToken: string;
    protected client: IClient;
    constructor(appUserToken: string, client: IClient);
    getProfile(tag: string): Promise<SecurityProfile>;
    getProfiles({page, pageSize}: {
        page?: number;
        pageSize?: number;
    }): Promise<SecurityProfile[]>;
}
