import * as et from 'elementtree';
import { ResourcesPlatform } from '../../definitions';
export interface PlatformEngine {
    name: string;
    spec: string;
    [key: string]: string;
}
export declare class ConfigXml {
    protected _filePath?: string;
    protected _doc?: et.ElementTree;
    readonly doc: et.ElementTree;
    readonly filePath: string;
    static load(projectDir: string): Promise<ConfigXml>;
    save(): Promise<void>;
    /**
     * Update config.xml content src to be a dev server url. As part of this
     * backup the original content src for a reset to occur at a later time.
     */
    writeContentSrc(newSrc: string): Promise<void>;
    /**
     * Set config.xml src url back to its original url
     */
    resetContentSrc(): Promise<void>;
    getPreference(prefName: string): Promise<string | undefined>;
    getProjectInfo(): Promise<{
        id: string;
        name: string;
        version: string;
    }>;
    getPlatformEngines(): Promise<PlatformEngine[]>;
    getPlatformEngine(platform: string): Promise<PlatformEngine | undefined>;
    ensurePlatformImages(platform: string, resourcesPlatform: ResourcesPlatform): Promise<void>;
    ensureSplashScreenPreferences(): Promise<void>;
    protected engineElementToPlatformEngine(engine: et.IElement): PlatformEngine;
}
