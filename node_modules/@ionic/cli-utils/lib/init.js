"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const minimist = require("minimist");
exports.parseArgs = minimist;
/**
 * Map legacy options to their new equivalent
 */
function modifyArguments(pargv) {
    let modifiedArgArray = pargv.slice();
    const minimistArgv = minimist(pargv, { boolean: true, string: '_' });
    if (pargv.length === 0) {
        return ['help'];
    }
    if (minimistArgv['help'] || minimistArgv['h']) {
        if (minimistArgv._.length > 0) {
            return ['help', ...minimistArgv._];
        }
        else {
            return ['help'];
        }
    }
    if (minimistArgv._.length === 0 && (minimistArgv['version'] || minimistArgv['v'])) {
        return ['version'];
    }
    if (minimistArgv._[0] === 'lab') {
        modifiedArgArray[0] = 'serve';
        modifiedArgArray.push('--lab');
    }
    if (minimistArgv['verbose']) {
        modifiedArgArray[modifiedArgArray.indexOf('--verbose')] = '--log-level=debug';
    }
    if (minimistArgv['quiet']) {
        modifiedArgArray[modifiedArgArray.indexOf('--quiet')] = '--log-level=warn';
    }
    return modifiedArgArray;
}
exports.modifyArguments = modifyArguments;
/**
 * Find the command that is the equivalent of a legacy command.
 */
function mapLegacyCommand(command) {
    const commandMap = {
        'compile': 'cordova compile',
        'emulate': 'cordova emulate',
        'platform': 'cordova platform',
        'plugin': 'cordova plugin',
        'prepare': 'cordova prepare',
        'resources': 'cordova resources',
        'run': 'cordova run',
        'cordova:build': 'cordova build',
        'cordova:compile': 'cordova compile',
        'cordova:emulate': 'cordova emulate',
        'cordova:platform': 'cordova platform',
        'cordova:plugin': 'cordova plugin',
        'cordova:prepare': 'cordova prepare',
        'cordova:resources': 'cordova resources',
        'cordova:run': 'cordova run',
    };
    return commandMap[command];
}
exports.mapLegacyCommand = mapLegacyCommand;
