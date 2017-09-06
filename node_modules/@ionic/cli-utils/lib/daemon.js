"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path = require("path");
const chalk = require("chalk");
const config_1 = require("./config");
const fs_1 = require("./utils/fs");
const plugins_1 = require("./plugins");
const modules_1 = require("./modules");
const KNOWN_PACKAGES = [
    ...[].concat(plugins_1.KNOWN_COMMAND_PLUGINS, plugins_1.KNOWN_GLOBAL_PLUGINS, plugins_1.KNOWN_PROJECT_PLUGINS).map(plugins_1.formatFullPluginName),
    '@ionic/cli-utils',
    'ionic',
];
exports.DAEMON_PID_FILE = 'daemon.pid';
exports.DAEMON_JSON_FILE = 'daemon.json';
exports.DAEMON_LOG_FILE = 'daemon.log';
class Daemon extends config_1.BaseConfig {
    get pidFilePath() {
        return path.join(this.directory, exports.DAEMON_PID_FILE);
    }
    get logFilePath() {
        return path.join(this.directory, exports.DAEMON_LOG_FILE);
    }
    getPid() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const f = yield fs_1.fsReadFile(this.pidFilePath, { encoding: 'utf8' });
                return Number(f);
            }
            catch (e) {
                if (e.code !== 'ENOENT') {
                    throw e;
                }
            }
        });
    }
    setPid(pid) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield fs_1.fsWriteFile(this.pidFilePath, String(pid), { encoding: 'utf8' });
        });
    }
    provideDefaults(o) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const lodash = modules_1.load('lodash');
            const results = lodash.cloneDeep(o);
            if (!results.daemonVersion) {
                results.daemonVersion = '';
            }
            if (!results.latestVersions) {
                results.latestVersions = {};
            }
            if (!results.latestVersions.latest) {
                results.latestVersions.latest = {};
            }
            for (let pkg of KNOWN_PACKAGES) {
                if (typeof results.latestVersions.latest[pkg] === 'undefined') {
                    results.latestVersions.latest[pkg] = '';
                }
            }
            return results;
        });
    }
    populateDistTag(distTag) {
        if (this.configFile) {
            if (typeof this.configFile.latestVersions[distTag] === 'undefined') {
                this.configFile.latestVersions[distTag] = {};
            }
            for (let pkg of KNOWN_PACKAGES) {
                if (typeof this.configFile.latestVersions[distTag][pkg] === 'undefined') {
                    this.configFile.latestVersions[distTag][pkg] = '';
                }
            }
        }
    }
    is(j) {
        return j
            && typeof j.latestVersions === 'object'
            && typeof j.latestVersions.latest === 'object';
    }
}
exports.Daemon = Daemon;
function processRunning(pid) {
    try {
        const r = process.kill(pid, 0);
        if (typeof r === 'boolean') {
            return r;
        }
        return true;
    }
    catch (e) {
        return e.code === 'EPERM';
    }
}
exports.processRunning = processRunning;
function checkForDaemon(env) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const config = yield env.config.load();
        if (!config.daemon.updates) {
            return 0;
        }
        const f = yield env.daemon.getPid();
        if (f && processRunning(f)) {
            env.log.debug(() => `Daemon found (pid: ${chalk.bold(String(f))})`);
            return f;
        }
        const crossSpawn = modules_1.load('cross-spawn');
        const fd = yield fs_1.fsOpen(env.daemon.logFilePath, 'a');
        const crossSpawnOptions = {
            cwd: env.config.directory,
            stdio: ['ignore', fd, fd],
        };
        // TODO: should cross-spawn figure this stuff out? https://github.com/IndigoUnited/node-cross-spawn/issues/77
        if (process.platform === 'win32') {
            crossSpawnOptions.shell = true;
            crossSpawnOptions.detached = false;
        }
        const crossSpawnArgs = [crossSpawnOptions.shell ? `"${env.meta.binPath}"` : env.meta.binPath, 'daemon', '--verbose', '--no-interactive', '--log-timestamps'];
        const p = crossSpawn.spawn(crossSpawnOptions.shell ? `"${process.execPath}"` : process.execPath, crossSpawnArgs, crossSpawnOptions);
        p.unref();
        env.log.debug(`New daemon pid: ${chalk.bold(String(p.pid))}`);
        return p.pid;
    });
}
exports.checkForDaemon = checkForDaemon;
