import { CommandLineInputs, CommandLineOptions } from '@ionic/cli-utils';
import { SSHBaseCommand } from './base';
export declare class SSHUseCommand extends SSHBaseCommand {
    run(inputs: CommandLineInputs, options: CommandLineOptions): Promise<void | number>;
}
