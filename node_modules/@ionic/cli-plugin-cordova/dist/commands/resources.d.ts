import { Command, CommandLineInputs, CommandLineOptions, CommandPreRun } from '@ionic/cli-utils';
export declare class ResourcesCommand extends Command implements CommandPreRun {
    preRun(inputs: CommandLineInputs, options: CommandLineOptions): Promise<void | number>;
    run(inputs: CommandLineInputs, options: CommandLineOptions): Promise<void | number>;
}
