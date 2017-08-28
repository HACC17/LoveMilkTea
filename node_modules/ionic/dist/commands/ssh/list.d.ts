import { CommandLineInputs, CommandLineOptions, CommandPreRun } from '@ionic/cli-utils';
import { SSHBaseCommand } from './base';
export declare class SSHListCommand extends SSHBaseCommand implements CommandPreRun {
    preRun(): Promise<void>;
    run(inputs: CommandLineInputs, options: CommandLineOptions): Promise<void>;
}
