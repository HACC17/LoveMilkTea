import * as archiver from 'archiver';
export declare function createArchive(format: 'zip' | 'tar'): archiver.Archiver;
export declare function tarXvfFromUrl(url: string, destination: string, {progress}: {
    progress?: (loaded: number, total: number) => void;
}): Promise<void>;
