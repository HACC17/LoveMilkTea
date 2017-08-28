"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs = require("fs");
const path = require("path");
const fs_1 = require("./lib/utils/fs");
function detectLocalCLI() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const dir = yield fs_1.findBaseDirectory(process.cwd(), 'package.json');
        if (dir) {
            const local = path.join(dir, 'node_modules', 'ionic');
            const ok = yield fs_1.pathAccessible(local, fs.constants.R_OK);
            if (ok) {
                return local;
            }
        }
    });
}
exports.detectLocalCLI = detectLocalCLI;
