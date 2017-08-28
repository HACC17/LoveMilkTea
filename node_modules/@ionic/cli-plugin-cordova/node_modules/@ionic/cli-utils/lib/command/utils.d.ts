import * as dargsType from 'dargs';
import * as minimistType from 'minimist';
import { CommandData, CommandLineOptions } from '../../definitions';
export interface MinimistOptionsToArrayOptions extends dargsType.Opts {
    useDoubleQuotes?: boolean;
}
export declare function minimistOptionsToArray(options: CommandLineOptions, fnOptions?: MinimistOptionsToArrayOptions): string[];
export declare function metadataToMinimistOptions(metadata: CommandData): minimistType.Opts;
export declare function validateInputs(argv: string[], metadata: CommandData): void;
export declare function filterOptionsByIntent(metadata: CommandData, options: CommandLineOptions, intentName?: string): CommandLineOptions;
