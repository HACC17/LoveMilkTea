import { CommandLineInputs, CommandLineOptions, CommandPreRun, IShellRunOptions } from '@ionic/cli-utils';
import { Command } from '@ionic/cli-utils/lib/command';
export declare const CORDOVA_RUN_COMMAND_OPTIONS: ({
    name: string;
    description: string;
    type: BooleanConstructor;
    intent: string;
} | {
    name: string;
    description: string;
    type: BooleanConstructor;
    aliases: string[];
} | {
    name: string;
    description: string;
    default: string;
} | {
    name: string;
    description: string;
    default: string;
    aliases: string[];
} | {
    name: string;
    description: string;
    type: BooleanConstructor;
} | {
    name: string;
    description: string;
    type: StringConstructor;
    intent: string;
} | {
    name: string;
    description: string;
    intent: string;
})[];
export declare class CordovaCommand extends Command {
    preRunChecks(): Promise<void>;
    runCordova(argList: string[], {fatalOnNotFound, truncateErrorOutput, ...options}?: IShellRunOptions): Promise<string>;
    checkForPlatformInstallation(runPlatform: string): Promise<void>;
}
export declare class CordovaRunCommand extends CordovaCommand implements CommandPreRun {
    preRun(inputs: CommandLineInputs, options: CommandLineOptions): Promise<void | number>;
    run(inputs: CommandLineInputs, options: CommandLineOptions): Promise<void>;
}
