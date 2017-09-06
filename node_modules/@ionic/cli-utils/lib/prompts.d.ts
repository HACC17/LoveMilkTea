import { ConfigFile, IConfig, ILogger, PromptModule } from '../definitions';
export declare function createPromptModule({interactive, confirm, log, config}: {
    interactive: boolean;
    confirm: boolean;
    log: ILogger;
    config: IConfig<ConfigFile>;
}): Promise<PromptModule>;
