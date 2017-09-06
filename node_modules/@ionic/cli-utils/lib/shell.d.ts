import { ILogger, IShell, IShellRunOptions, ITaskChain } from '../definitions';
export declare const ERROR_SHELL_COMMAND_NOT_FOUND = "SHELL_COMMAND_NOT_FOUND";
export declare class Shell implements IShell {
    protected tasks: ITaskChain;
    protected log: ILogger;
    constructor(tasks: ITaskChain, log: ILogger);
    run(command: string, args: string[], {showCommand, showError, fatalOnNotFound, fatalOnError, showExecution, truncateErrorOutput, ...crossSpawnOptions}: IShellRunOptions): Promise<string>;
}
