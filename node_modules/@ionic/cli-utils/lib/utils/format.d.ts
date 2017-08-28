export declare const ICON_ELLIPSIS: string;
export declare const ICON_SUCCESS: string;
export declare const ICON_FAILURE: string;
export declare const SPINNER_FRAMES: string[];
export declare const TTY_WIDTH: number;
export declare function prettyPath(p: string): string;
export declare function indent(n?: number): string;
export declare function wordWrap(msg: string, {indentation, append}: {
    indentation?: number;
    append?: string;
}): string;
export declare function generateFillSpaceStringList(list: string[], optimalLength?: number, fillCharacter?: string): string[];
export declare function columnar(rows: string[][], {hsep, vsep, columnHeaders}?: {
    hsep?: string;
    vsep?: string;
    columnHeaders?: string[];
}): string;
