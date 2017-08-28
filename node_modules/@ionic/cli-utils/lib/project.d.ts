import { BowerJson, IProject, PackageJson, ProjectFile, ProjectType } from '../definitions';
import { BaseConfig } from './config';
export declare const PROJECT_FILE = "ionic.config.json";
export declare const PROJECT_FILE_LEGACY = "ionic.project";
export declare const PROJECT_TYPES: ProjectType[];
export declare class Project extends BaseConfig<ProjectFile> implements IProject {
    directory: string;
    protected packageJsonFile?: PackageJson;
    protected bowerJsonFile?: BowerJson;
    loadAppId(): Promise<string>;
    loadPackageJson(): Promise<PackageJson>;
    loadBowerJson(): Promise<BowerJson>;
    provideDefaults(o: any): Promise<any>;
    determineType(): Promise<ProjectType>;
    is(j: any): j is ProjectFile;
    formatType(type: ProjectType): "Ionic Angular" | "Ionic 1";
}
