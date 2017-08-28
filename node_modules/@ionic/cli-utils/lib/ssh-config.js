"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path = require("path");
const os = require("os");
const SSHConfigModule = require("ssh-config");
exports.SSHConfig = SSHConfigModule;
const fs_1 = require("./utils/fs");
function loadFromPath(p) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const s = yield fs_1.fileToString(p);
        return exports.SSHConfig.parse(s);
    });
}
exports.loadFromPath = loadFromPath;
function isDirective(entry) {
    return entry && entry.type === exports.SSHConfig.DIRECTIVE;
}
exports.isDirective = isDirective;
function getConfigPath() {
    return path.resolve(os.homedir(), '.ssh', 'config');
}
exports.getConfigPath = getConfigPath;
function findHostSection(conf, host) {
    return conf.find({ Host: host });
}
exports.findHostSection = findHostSection;
function ensureHostAndKeyPath(conf, conn, keyPath) {
    const section = ensureSection(conf, conn.host, conf ? true : false);
    ensureSectionLine(section, 'IdentityFile', keyPath);
    if (typeof conn.port === 'number') {
        ensureSectionLine(section, 'Port', String(conn.port));
    }
}
exports.ensureHostAndKeyPath = ensureHostAndKeyPath;
function ensureSection(conf, host, newline) {
    const section = findHostSection(conf, host);
    if (!section) {
        conf.push(exports.SSHConfig.parse(`${newline ? '\n' : ''}Host ${host}\n`)[0]);
    }
    return conf.find({ Host: host });
}
exports.ensureSection = ensureSection;
function ensureSectionLine(section, key, value) {
    const found = section.config.some((line) => {
        if (isDirective(line)) {
            if (line.param === key) {
                line.value = value;
                return true;
            }
        }
        return false;
    });
    if (!found) {
        section.config = section.config.concat(exports.SSHConfig.parse(`${key} ${value}\n`));
    }
}
exports.ensureSectionLine = ensureSectionLine;
