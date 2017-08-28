import { IonicEnvironment } from '@ionic/cli-utils';
/**
 * Get all platforms based on platforms directory
 * TODO: should we get this from the config.xml or just the directories like app-lib
 */
export declare function getProjectPlatforms(projectDir: string): Promise<string[]>;
/**
 * Install the platform specified using cordova
 */
export declare function installPlatform(env: IonicEnvironment, platform: string): Promise<string>;
