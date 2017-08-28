import { CommandLineInputs, CommandLineOptions, CommandPreRun } from '@ionic/cli-utils';
import { Command } from '@ionic/cli-utils/lib/command';
export declare class PackageBuildCommand extends Command implements CommandPreRun {
    preRun(inputs: CommandLineInputs, options: CommandLineOptions): Promise<void | number>;
    run(inputs: CommandLineInputs, options: CommandLineOptions): Promise<void | number>;
}
