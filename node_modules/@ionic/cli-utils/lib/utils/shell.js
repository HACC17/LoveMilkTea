"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const os = require("os");
const path = require("path");
const errors_1 = require("../errors");
const TILDE_PATH_REGEX = /^~($|\/|\\)/;
function expandTildePath(p) {
    const h = os.homedir();
    return p.replace(TILDE_PATH_REGEX, `${h}$1`);
}
exports.expandTildePath = expandTildePath;
function runcmd(command, args, options = {}) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const crossSpawn = yield Promise.resolve().then(function () { return require('cross-spawn'); });
        return new Promise((resolve, reject) => {
            if (!options.env) {
                options.env = Object.assign({}, process.env, { PATH: process.env.PATH.split(path.delimiter).map(expandTildePath).join(path.delimiter) });
            }
            const p = crossSpawn.spawn(command, args, options);
            const stdoutBufs = [];
            const stderrBufs = [];
            const dualBufs = [];
            if (p.stdout) {
                p.stdout.on('data', (chunk) => {
                    if (options.stdoutPipe) {
                        options.stdoutPipe.write(chunk);
                    }
                    else {
                        if (Buffer.isBuffer(chunk)) {
                            stdoutBufs.push(chunk);
                            dualBufs.push(chunk);
                        }
                        else {
                            stdoutBufs.push(Buffer.from(chunk));
                            dualBufs.push(Buffer.from(chunk));
                        }
                    }
                });
            }
            if (p.stderr) {
                p.stderr.on('data', (chunk) => {
                    if (options.stderrPipe) {
                        options.stderrPipe.write(chunk);
                    }
                    else {
                        if (Buffer.isBuffer(chunk)) {
                            stderrBufs.push(chunk);
                            dualBufs.push(chunk);
                        }
                        else {
                            stderrBufs.push(Buffer.from(chunk));
                            dualBufs.push(Buffer.from(chunk));
                        }
                    }
                });
            }
            p.on('error', (err) => {
                reject(err);
            });
            p.on('close', (code) => {
                if (code === 0) {
                    resolve(Buffer.concat(stdoutBufs).toString());
                }
                else {
                    reject(new errors_1.ShellException(Buffer.concat(dualBufs).toString(), code));
                }
            });
        });
    });
}
exports.runcmd = runcmd;
function getCommandInfo(cmd, args = []) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            const out = yield runcmd(cmd, args);
            return out.split('\n').join(' ');
        }
        catch (e) { }
    });
}
exports.getCommandInfo = getCommandInfo;
