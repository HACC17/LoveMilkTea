import { CommandLineInputs, CommandLineOptions, CommandPreRun } from '@ionic/cli-utils';
import { Command } from '@ionic/cli-utils/lib/command';
export declare class StartCommand extends Command implements CommandPreRun {
    preRun(inputs: CommandLineInputs, options: CommandLineOptions): Promise<number | void>;
    run(inputs: CommandLineInputs, options: CommandLineOptions): Promise<number | void>;
}
