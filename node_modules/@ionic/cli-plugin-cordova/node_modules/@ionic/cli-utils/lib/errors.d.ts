export declare class Exception extends Error {
    message: string;
    name: string;
    stack: string;
    constructor(message: string);
    toString(): string;
}
export declare class FatalException extends Exception {
    message: string;
    exitCode: number;
    fatal: boolean;
    constructor(message: string, exitCode?: number);
}
export declare class ShellException extends Exception {
    message: string;
    exitCode: number;
    constructor(message: string, exitCode?: number);
}
