/// <reference types="node" />
export declare function s3SignedUpload(presignedPostParams: {
    url: string;
    fields: Object;
}, zip: NodeJS.ReadableStream, {progress}: {
    progress?: (loaded: number, total: number) => void;
}): Promise<void>;
