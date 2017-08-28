import { CommandData, CommandLineInputs, CommandLineOptions } from '@ionic/cli-utils';
export declare const CORDOVA_INTENT = "CORDOVA";
/**
 * Filter and gather arguments from command line to be passed to Cordova
 */
export declare function filterArgumentsForCordova(metadata: CommandData, inputs: CommandLineInputs, options: CommandLineOptions): string[];
/**
 * Start the app scripts server for emulator or device
 */
export declare function generateBuildOptions(metadata: CommandData, options: CommandLineOptions): CommandLineOptions;
