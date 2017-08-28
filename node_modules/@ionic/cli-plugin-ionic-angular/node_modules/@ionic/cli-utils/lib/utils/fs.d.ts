/// <reference types="node" />
import * as fs from 'fs';
export declare const ERROR_FILE_NOT_FOUND = "FILE_NOT_FOUND";
export declare const ERROR_FILE_INVALID_JSON = "FILE_INVALID_JSON";
export declare const ERROR_OVERWRITE_DENIED = "OVERWRITE_DENIED";
export interface FSReadFileOptions {
    encoding: string;
    flag?: string;
}
export interface FSWriteFileOptions {
    encoding: string;
    mode?: number;
    flag?: string;
}
export declare const fsAccess: (arg1: string, arg2: number) => Promise<void>;
export declare const fsMkdir: (arg1: string, arg2: number | undefined) => Promise<void>;
export declare const fsOpen: (arg1: string, arg2: string) => Promise<number>;
export declare const fsStat: (arg1: string) => Promise<fs.Stats>;
export declare const fsUnlink: (arg1: string) => Promise<void>;
export declare const fsReadFile: (arg1: string, arg2: FSReadFileOptions) => Promise<string>;
export declare const fsWriteFile: (arg1: string, arg2: any, arg3: FSWriteFileOptions) => Promise<void>;
export declare const fsReadDir: (arg1: string) => Promise<string[]>;
export declare function readDir(filePath: string): Promise<string[]>;
export declare function fsReadJsonFile(filePath: string, options?: FSReadFileOptions): Promise<{
    [key: string]: any;
}>;
export declare function fsWriteJsonFile(filePath: string, json: {
    [key: string]: any;
}, options: FSWriteFileOptions): Promise<void>;
export declare function fileToString(filepath: string): Promise<string>;
export declare function fsMkdirp(p: string, mode?: number): Promise<void>;
export declare function getFileChecksum(filePath: string): Promise<string>;
export declare function writeStreamToFile(stream: NodeJS.ReadableStream, destination: string): Promise<any>;
export declare function copyDirectory(source: string, destination: string): Promise<void>;
export declare function copyFile(fileName: string, target: string, mode?: number): Promise<{}>;
export declare function pathAccessible(filePath: string, mode: number): Promise<boolean>;
export declare function pathExists(filePath: string): Promise<boolean>;
/**
 * Find the base directory based on the path given and a marker file to look for.
 */
export declare function findBaseDirectory(dir: string, file: string): Promise<string | undefined>;
