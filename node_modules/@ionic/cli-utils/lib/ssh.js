"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const os = require("os");
const path = require("path");
const fs_1 = require("./utils/fs");
exports.ERROR_SSH_MISSING_PRIVKEY = 'SSH_MISSING_PRIVKEY';
exports.ERROR_SSH_INVALID_PUBKEY = 'SSH_INVALID_PUBKEY';
exports.ERROR_SSH_INVALID_PRIVKEY = 'SSH_INVALID_PRIVKEY';
function getGeneratedPrivateKeyPath(env) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const config = yield env.config.load();
        const id = config.user.id ? config.user.id : 'anonymous';
        return path.resolve(os.homedir(), '.ssh', 'ionic', `${id}_rsa`);
    });
}
exports.getGeneratedPrivateKeyPath = getGeneratedPrivateKeyPath;
function parsePublicKeyFile(pubkeyPath) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            yield fs_1.fsStat(pubkeyPath);
        }
        catch (e) {
            if (e.code === 'ENOENT') {
                throw fs_1.ERROR_FILE_NOT_FOUND;
            }
            throw e;
        }
        return parsePublicKey((yield fs_1.fsReadFile(pubkeyPath, { encoding: 'utf8' })).trim());
    });
}
exports.parsePublicKeyFile = parsePublicKeyFile;
/**
 * @return Promise<[full pubkey, algorithm, public numbers, annotation]>
 */
function parsePublicKey(pubkey) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const r = /^(ssh-[r|d]sa)\s([A-z0-9+\/=]+)\s?(.+)?$/.exec(pubkey);
        if (!r) {
            throw exports.ERROR_SSH_INVALID_PUBKEY;
        }
        if (!r[3]) {
            r[3] = '';
        }
        r[1] = r[1].trim();
        r[2] = r[2].trim();
        r[3] = r[3].trim();
        return [pubkey, r[1], r[2], r[3]];
    });
}
exports.parsePublicKey = parsePublicKey;
function validatePrivateKey(keyPath) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            yield fs_1.fsStat(keyPath);
        }
        catch (e) {
            if (e.code === 'ENOENT') {
                throw exports.ERROR_SSH_MISSING_PRIVKEY;
            }
            throw e;
        }
        const f = yield fs_1.fsReadFile(keyPath, { encoding: 'utf8' });
        const lines = f.split('\n');
        if (!lines[0].match(/^\-{5}BEGIN [R|D]SA PRIVATE KEY\-{5}$/)) {
            throw exports.ERROR_SSH_INVALID_PRIVKEY;
        }
    });
}
exports.validatePrivateKey = validatePrivateKey;
