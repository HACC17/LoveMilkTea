"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const shell_1 = require("./shell");
function getCommandInfo(cmd, args = []) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            const out = yield shell_1.runcmd(cmd, args);
            return out.split('\n').join(' ');
        }
        catch (e) { }
    });
}
exports.getCommandInfo = getCommandInfo;
