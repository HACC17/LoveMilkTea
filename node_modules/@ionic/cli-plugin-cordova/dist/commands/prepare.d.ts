import { CommandLineInputs, CommandLineOptions, CommandPreRun } from '@ionic/cli-utils';
import { CordovaCommand } from './base';
export declare class PrepareCommand extends CordovaCommand implements CommandPreRun {
    preRun(inputs: CommandLineInputs, options: CommandLineOptions): Promise<void>;
    run(inputs: CommandLineInputs, options: CommandLineOptions): Promise<void>;
}
