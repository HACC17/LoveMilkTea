"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cli_utils_1 = require("@ionic/cli-utils");
exports.CORDOVA_INTENT = 'CORDOVA';
/**
 * Filter and gather arguments from command line to be passed to Cordova
 */
function filterArgumentsForCordova(metadata, inputs, options) {
    const results = cli_utils_1.filterOptionsByIntent(metadata, options, exports.CORDOVA_INTENT);
    const args = cli_utils_1.minimistOptionsToArray(results, { useEquals: false, allowCamelCase: true });
    let unparsedCdvArgs = [];
    const indexOfSep = inputs.indexOf('--');
    if (indexOfSep >= 0) {
        unparsedCdvArgs = inputs.splice(indexOfSep);
    }
    return [metadata.name].concat(inputs, args, unparsedCdvArgs);
}
exports.filterArgumentsForCordova = filterArgumentsForCordova;
/**
 * Start the app scripts server for emulator or device
 */
function generateBuildOptions(metadata, options) {
    const results = cli_utils_1.filterOptionsByIntent(metadata, options);
    // Serve specific options not related to the actual run or emulate code
    return Object.assign({}, results, { iscordovaserve: true, nobrowser: true });
}
exports.generateBuildOptions = generateBuildOptions;
