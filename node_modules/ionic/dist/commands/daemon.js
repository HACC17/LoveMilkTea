"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk = require("chalk");
const command_1 = require("@ionic/cli-utils/lib/command");
const fs_1 = require("@ionic/cli-utils/lib/utils/fs");
let DaemonCommand = class DaemonCommand extends command_1.Command {
    run(inputs, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { prettyPath } = yield Promise.resolve().then(function () { return require('@ionic/cli-utils/lib/utils/format'); });
            const { processRunning } = yield Promise.resolve().then(function () { return require('@ionic/cli-utils/lib/daemon'); });
            const { pkgLatestVersion } = yield Promise.resolve().then(function () { return require('@ionic/cli-utils/lib/utils/npm'); });
            const { determineDistTag, versionNeedsUpdating } = yield Promise.resolve().then(function () { return require('@ionic/cli-utils/lib/plugins'); });
            const updateInterval = Number(options.interval);
            const killExisting = options['kill-existing'];
            const config = yield this.env.config.load();
            if (!config.daemon.updates) {
                this.env.log.info('Daemon is disabled.');
                return 1;
            }
            const f = yield this.env.daemon.getPid();
            const d = yield this.env.daemon.load();
            d.daemonVersion = this.env.plugins.ionic.meta.version;
            const daemonDistTag = determineDistTag(this.env.plugins.ionic.meta.version);
            let latestIonicVersion = this.env.plugins.ionic.meta.latestVersion;
            if (!latestIonicVersion) {
                latestIonicVersion = yield pkgLatestVersion(this.env, 'ionic', daemonDistTag);
                if (!latestIonicVersion) {
                    this.env.log.error('Could not get latest version of ionic.');
                    return 1;
                }
                this.env.daemon.populateDistTag(daemonDistTag);
                d.latestVersions[daemonDistTag]['ionic'] = latestIonicVersion;
            }
            yield this.env.daemon.save();
            if (f) {
                this.env.log.info(`Daemon pid file found: ${chalk.bold(prettyPath(this.env.daemon.pidFilePath))}`);
                if (killExisting) {
                    this.env.log.info(`Killing existing daemon process ${chalk.bold(String(f))}.`);
                    yield fs_1.fsUnlink(this.env.daemon.pidFilePath);
                    try {
                        process.kill(Number(f));
                    }
                    catch (e) {
                        if (e.code !== 'ESRCH') {
                            throw e;
                        }
                    }
                }
                else if (!processRunning(f)) {
                    this.env.log.info(`Process ${chalk.bold(String(f))} not found, deleting pid file.`);
                    yield fs_1.fsUnlink(this.env.daemon.pidFilePath);
                }
                else {
                    this.env.log.info('Daemon already running and up-to-date.');
                    return 0;
                }
            }
            this.env.log.info(`Writing ${chalk.bold(String(process.pid))} to daemon pid file (${chalk.bold(prettyPath(this.env.daemon.pidFilePath))}).`);
            yield this.env.daemon.setPid(process.pid);
            const updateFn = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
                const config = yield this.env.config.load({ disk: true });
                const f = yield this.env.daemon.getPid();
                const d = yield this.env.daemon.load({ disk: true });
                if (!f) {
                    this.env.log.info(`Daemon shutting down--pid file missing.`);
                    return process.exit();
                }
                else if (f !== process.pid) {
                    this.env.log.info(`Daemon shutting down--mismatch with pid file. (${chalk.bold(String(f))} vs ${chalk.bold(String(process.pid))})`);
                    return process.exit();
                }
                else if (!config.daemon.updates) {
                    this.env.log.info(`Daemon shutting down--daemon was disabled.`);
                    return process.exit();
                }
                else if (daemonDistTag !== determineDistTag(config.version)) {
                    this.env.log.info(`Daemon shutting down--dist-tag mismatch. (${chalk.bold(d.daemonVersion)} vs ${chalk.bold(config.version)})`);
                    return process.exit();
                }
                else if (yield versionNeedsUpdating(d.daemonVersion, config.version)) {
                    this.env.log.info(`Daemon shutting down--out-of-date. (${chalk.bold(d.daemonVersion)} vs ${chalk.bold(config.version)})`);
                    return process.exit();
                }
                for (let distTag in d.latestVersions) {
                    const pkgs = Object.keys(d.latestVersions[distTag]);
                    const pkgUpdates = yield Promise.all(pkgs.map(pkg => pkgLatestVersion(this.env, pkg, distTag)));
                    for (let i in pkgUpdates) {
                        d.latestVersions[distTag][pkgs[i]] = pkgUpdates[i] || '';
                    }
                }
                this.env.log.info('Writing daemon file.');
                yield this.env.daemon.save();
            });
            const cleanup = () => {
                try {
                    const fs = require('fs');
                    fs.unlinkSync(this.env.daemon.pidFilePath);
                }
                catch (e) {
                    if (e.code !== 'ENOENT') {
                        throw e;
                    }
                }
                process.exit();
            };
            process.on('exit', cleanup);
            process.on('SIGINT', cleanup);
            process.on('SIGTERM', cleanup);
            process.on('SIGHUP', cleanup);
            process.on('SIGBREAK', cleanup);
            const delayMs = 5 * 1000; // wait 5 seconds before doing first check
            const updateIntervalMs = updateInterval * 1000; // check every interval
            setTimeout(() => tslib_1.__awaiter(this, void 0, void 0, function* () {
                yield updateFn();
                setInterval(updateFn, updateIntervalMs);
            }), delayMs);
        });
    }
};
DaemonCommand = tslib_1.__decorate([
    command_1.CommandMetadata({
        name: 'daemon',
        type: 'global',
        description: 'Ionic update checker daemon',
        options: [
            {
                name: 'interval',
                description: 'Interval, in seconds, to check for updates',
                default: '900',
            },
            {
                name: 'kill-existing',
                description: 'If an existing daemon is found, force kill it',
                type: Boolean,
            },
        ],
        visible: false,
    })
], DaemonCommand);
exports.DaemonCommand = DaemonCommand;
