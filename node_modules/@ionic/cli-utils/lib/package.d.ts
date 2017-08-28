/// <reference types="node" />
import { IClient, PackageBuild, PackageProjectRequest } from '../definitions';
export declare class PackageClient {
    protected appUserToken: string;
    protected client: IClient;
    constructor(appUserToken: string, client: IClient);
    getBuild(id: number, {fields}: {
        fields?: string[];
    }): Promise<PackageBuild>;
    getBuilds({page, pageSize}: {
        page?: number;
        pageSize?: number;
    }): Promise<PackageBuild[]>;
    queueBuild({platform, mode, zipUrl, projectId, profileTag}: {
        platform: PackageBuild['platform'];
        mode: PackageBuild['mode'];
        zipUrl: string;
        projectId: number;
        profileTag?: string;
    }): Promise<PackageBuild>;
    requestProjectUpload(): Promise<PackageProjectRequest>;
    uploadProject(project: PackageProjectRequest, zip: NodeJS.ReadableStream, {progress}: {
        progress?: (loaded: number, total: number) => void;
    }): Promise<void>;
    downloadBuild(build: PackageBuild, dest: NodeJS.WritableStream, {progress}: {
        progress?: (loaded: number, total: number) => void;
    }): Promise<void>;
    colorStatus(s: PackageBuild['status']): string;
    formatFilename(build: PackageBuild): string;
    formatPlatform(p: PackageBuild['platform'] | string): string;
    formatBuildValues(build: PackageBuild): {
        [P in keyof PackageBuild]?: string;
    };
}
