import { DeploySnapshotRequest, IonicEnvironment } from '../definitions';
export declare function upload(env: IonicEnvironment, {note, channelTag, metadata}: {
    note?: string;
    channelTag?: string;
    metadata?: Object;
}): Promise<DeploySnapshotRequest>;
