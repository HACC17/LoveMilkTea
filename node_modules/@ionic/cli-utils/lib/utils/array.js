"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Recursively flatten an array.
 */
function flattenArray(arr) {
    return arr.reduce(function (flat, toFlatten) {
        return flat.concat(Array.isArray(toFlatten) ? flattenArray(toFlatten) : toFlatten);
    }, []);
}
exports.flattenArray = flattenArray;
