/// <reference types="node" />
import { Deploy, DeployChannel, DeploySnapshot, DeploySnapshotRequest, IClient } from '../definitions';
export declare class DeployClient {
    protected appUserToken: string;
    protected client: IClient;
    constructor(appUserToken: string, client: IClient);
    getChannel(uuidOrTag: string): Promise<DeployChannel>;
    deploy(snapshot: string, channel: string): Promise<Deploy>;
    getSnapshot(uuid: string, {fields}: {
        fields?: string[];
    }): Promise<DeploySnapshot>;
    requestSnapshotUpload(options?: {
        legacy_duplication?: string;
        note?: string;
        user_metadata?: Object;
    }): Promise<DeploySnapshotRequest>;
    uploadSnapshot(snapshot: DeploySnapshotRequest, zip: NodeJS.ReadableStream, progress?: (loaded: number, total: number) => void): Promise<void>;
}
