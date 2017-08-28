"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs = require("fs");
const path = require("path");
const promise_1 = require("./promise");
exports.ERROR_FILE_NOT_FOUND = 'FILE_NOT_FOUND';
exports.ERROR_FILE_INVALID_JSON = 'FILE_INVALID_JSON';
exports.ERROR_OVERWRITE_DENIED = 'OVERWRITE_DENIED';
exports.fsAccess = promise_1.promisify(fs.access);
exports.fsMkdir = promise_1.promisify(fs.mkdir);
exports.fsOpen = promise_1.promisify(fs.open);
exports.fsStat = promise_1.promisify(fs.stat);
exports.fsUnlink = promise_1.promisify(fs.unlink);
exports.fsReadFile = promise_1.promisify(fs.readFile);
exports.fsWriteFile = promise_1.promisify(fs.writeFile);
exports.fsReadDir = promise_1.promisify(fs.readdir);
function readDir(filePath) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            return yield exports.fsReadDir(filePath);
        }
        catch (e) {
            if (e.code === 'ENOENT') {
                return [];
            }
            throw e;
        }
    });
}
exports.readDir = readDir;
function fsReadJsonFile(filePath, options = { encoding: 'utf8' }) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            const f = yield exports.fsReadFile(filePath, options);
            return JSON.parse(f);
        }
        catch (e) {
            if (e.code === 'ENOENT') {
                throw exports.ERROR_FILE_NOT_FOUND;
            }
            else if (e instanceof SyntaxError) {
                throw exports.ERROR_FILE_INVALID_JSON;
            }
            throw e;
        }
    });
}
exports.fsReadJsonFile = fsReadJsonFile;
function fsWriteJsonFile(filePath, json, options) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return exports.fsWriteFile(filePath, JSON.stringify(json, null, 2) + '\n', options);
    });
}
exports.fsWriteJsonFile = fsWriteJsonFile;
function fileToString(filepath) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            return yield exports.fsReadFile(filepath, { encoding: 'utf8' });
        }
        catch (e) {
            if (e.code === 'ENOENT') {
                return '';
            }
            throw e;
        }
    });
}
exports.fileToString = fileToString;
function fsMkdirp(p, mode) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const absPath = path.resolve(p);
        const pathObj = path.parse(absPath);
        const dirnames = absPath.split(path.sep).splice(1);
        const dirs = dirnames.map((v, i) => path.resolve(pathObj.root, ...dirnames.slice(0, i), v));
        for (let dir of dirs) {
            try {
                yield exports.fsMkdir(dir, mode);
            }
            catch (e) {
                if (e.code !== 'EEXIST') {
                    throw e;
                }
            }
        }
    });
}
exports.fsMkdirp = fsMkdirp;
function getFileChecksum(filePath) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const crypto = yield Promise.resolve().then(function () { return require('crypto'); });
        return new Promise((resolve, reject) => {
            const hash = crypto.createHash('md5');
            const input = fs.createReadStream(filePath);
            input.on('error', (err) => {
                reject(err);
            });
            hash.once('readable', () => {
                const fullChecksum = hash.read().toString('hex');
                resolve(fullChecksum);
            });
            input.pipe(hash);
        });
    });
}
exports.getFileChecksum = getFileChecksum;
function writeStreamToFile(stream, destination) {
    return new Promise((resolve, reject) => {
        const dest = fs.createWriteStream(destination);
        stream.pipe(dest);
        dest.on('error', reject);
        dest.on('finish', resolve);
    });
}
exports.writeStreamToFile = writeStreamToFile;
function copyDirectory(source, destination) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const ncp = yield Promise.resolve().then(function () { return require('ncp'); });
        return new Promise((resolve, reject) => {
            ncp.ncp(source, destination, (err) => {
                if (err) {
                    reject(err);
                }
                resolve();
            });
        });
    });
}
exports.copyDirectory = copyDirectory;
function copyFile(fileName, target, mode = 0o777) {
    return new Promise((resolve, reject) => {
        const rs = fs.createReadStream(fileName);
        const ws = fs.createWriteStream(target, { mode: mode });
        rs.on('error', reject);
        ws.on('error', reject);
        ws.on('open', function () {
            rs.pipe(ws);
        });
        ws.once('finish', resolve);
    });
}
exports.copyFile = copyFile;
function pathAccessible(filePath, mode) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            yield exports.fsAccess(filePath, mode);
        }
        catch (e) {
            return false;
        }
        return true;
    });
}
exports.pathAccessible = pathAccessible;
function pathExists(filePath) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return pathAccessible(filePath, fs.constants.F_OK);
    });
}
exports.pathExists = pathExists;
/**
 * Find the base directory based on the path given and a marker file to look for.
 */
function findBaseDirectory(dir, file) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        dir = path.normalize(dir);
        const dirInfo = path.parse(dir);
        const directoriesToCheck = dirInfo.dir
            .slice(dirInfo.root.length)
            .split(path.sep)
            .concat(dirInfo.base)
            .map((segment, index, array) => {
            let pathSegments = array.slice(0, (array.length - index));
            return dirInfo.root + path.join(...pathSegments);
        });
        for (let i = 0; i < directoriesToCheck.length; i++) {
            const results = yield exports.fsReadDir(directoriesToCheck[i]);
            if (results.includes(file)) {
                return directoriesToCheck[i];
            }
        }
    });
}
exports.findBaseDirectory = findBaseDirectory;
