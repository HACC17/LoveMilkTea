import { IonicEnvironment } from '@ionic/cli-utils';
import * as AppScriptsType from '@ionic/app-scripts';
export declare function getPages(context: AppScriptsType.BuildContext): Promise<{
    fileName: string;
    absolutePath: string;
    relativePath: string;
}[]>;
export declare function prompt(context: AppScriptsType.BuildContext): Promise<string>;
export declare function getModules(context: AppScriptsType.BuildContext, kind: string): Promise<string>;
export declare function tabsPrompt(env: IonicEnvironment): Promise<string[]>;
