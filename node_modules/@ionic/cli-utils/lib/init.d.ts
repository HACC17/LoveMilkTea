import * as minimist from 'minimist';
export declare const parseArgs: typeof minimist;
/**
 * Map legacy options to their new equivalent
 */
export declare function modifyArguments(pargv: string[]): string[];
/**
 * Find the command that is the equivalent of a legacy command.
 */
export declare function mapLegacyCommand(command: string): string | undefined;
