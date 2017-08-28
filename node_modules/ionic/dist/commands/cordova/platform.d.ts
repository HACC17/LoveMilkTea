import { CommandLineInputs, CommandLineOptions, CommandPreRun } from '@ionic/cli-utils';
import { CordovaCommand } from './base';
export declare class PlatformCommand extends CordovaCommand implements CommandPreRun {
    preRun(inputs: CommandLineInputs, options: CommandLineOptions): Promise<void | number>;
    run(inputs: CommandLineInputs, options: CommandLineOptions): Promise<void>;
}
