/// <reference types="node" />
import * as chalk from 'chalk';
import { ILogger, LogLevel, LoggerOptions } from '../../definitions';
export declare const LOGGER_STATUS_COLORS: Map<LogLevel, chalk.ChalkStyle>;
export declare class Logger implements ILogger {
    readonly level: LogLevel;
    readonly prefix: string | (() => string);
    stream: NodeJS.WritableStream;
    constructor({level, prefix, stream}: LoggerOptions);
    debug(msg: string | (() => string)): void;
    info(msg: string | (() => string)): void;
    ok(msg: string | (() => string)): void;
    warn(msg: string | (() => string)): void;
    error(msg: string | (() => string)): void;
    msg(msg: string | (() => string)): void;
    nl(num?: number): void;
    shouldLog(level: LogLevel): boolean;
    private enforceLF(str);
    private getStatusColor(level);
    private log(level, msg);
}
