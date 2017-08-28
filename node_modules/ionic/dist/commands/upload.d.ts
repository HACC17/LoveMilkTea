import { CommandLineInput, CommandLineInputs, CommandLineOptions } from '@ionic/cli-utils';
import { Command } from '@ionic/cli-utils/lib/command';
export declare class UploadCommand extends Command {
    resolveNote(input: CommandLineInput): string | undefined;
    resolveMetaData(input: CommandLineInput): any;
    resolveChannelTag(input: CommandLineInput): string | undefined;
    run(inputs: CommandLineInputs, options: CommandLineOptions): Promise<void>;
}
