import { CommandLineInputs, CommandLineOptions, CommandPreRun } from '@ionic/cli-utils';
import { SSHBaseCommand } from './base';
export declare class SSHAddCommand extends SSHBaseCommand implements CommandPreRun {
    preRun(inputs: CommandLineInputs, options: CommandLineOptions): Promise<void>;
    run(inputs: CommandLineInputs, options: CommandLineOptions): Promise<void | number>;
}
