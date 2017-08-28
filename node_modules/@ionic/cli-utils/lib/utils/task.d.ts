import * as inquirerType from 'inquirer';
import ui = inquirerType.ui;
import { ILogger, ITask, ITaskChain } from '../../definitions';
export declare class TaskChain implements ITaskChain {
    log: ILogger;
    protected currentTask?: ITask;
    protected tasks: ITask[];
    constructor({log}: {
        log: ILogger;
    });
    next(msg: string): ITask;
    protected _next(task: ITask): ITask;
    updateMsg(msg: string): this;
    end(): this;
    fail(): this;
    cleanup(): this;
}
export declare class InteractiveTaskChain extends TaskChain {
    bottomBar: ui.BottomBar;
    constructor({log, bottomBar}: {
        log: ILogger;
        bottomBar: ui.BottomBar;
    });
    next(msg: string): ITask;
}
