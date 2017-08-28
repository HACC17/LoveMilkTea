import { CommandLineInputs, CommandLineOptions } from '@ionic/cli-utils';
import { SSHBaseCommand } from './base';
export declare class SSHSetupCommand extends SSHBaseCommand {
    preRun(): Promise<void>;
    run(inputs: CommandLineInputs, options: CommandLineOptions): Promise<void | number>;
}
