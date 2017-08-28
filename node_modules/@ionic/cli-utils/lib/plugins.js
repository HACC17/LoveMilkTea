"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const guards_1 = require("../guards");
const errors_1 = require("./errors");
const fs_1 = require("./utils/fs");
const http_1 = require("./utils/http");
const npm_1 = require("./utils/npm");
exports.ERROR_PLUGIN_NOT_INSTALLED = 'PLUGIN_NOT_INSTALLED';
exports.ERROR_PLUGIN_NOT_FOUND = 'PLUGIN_NOT_FOUND';
exports.ERROR_PLUGIN_INVALID = 'PLUGIN_INVALID';
exports.KNOWN_PLUGINS = ['proxy'];
const ORG_PREFIX = '@ionic';
const PLUGIN_PREFIX = 'cli-plugin-';
function formatFullPluginName(name) {
    return `${ORG_PREFIX}/${PLUGIN_PREFIX}${name}`;
}
exports.formatFullPluginName = formatFullPluginName;
function promptToInstallPlugin(env, pluginName, { message, global = false, reinstall = false }) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (!global && !env.project.directory) {
            return;
        }
        try {
            return yield loadPlugin(env, pluginName, {
                askToInstall: true,
                global,
                reinstall,
                message,
            });
        }
        catch (e) {
            if (e !== exports.ERROR_PLUGIN_NOT_INSTALLED) {
                throw e;
            }
        }
    });
}
exports.promptToInstallPlugin = promptToInstallPlugin;
function registerPlugin(env, plugin) {
    if (plugin.registerHooks) {
        plugin.registerHooks(env.hooks);
    }
    env.plugins[plugin.meta.name] = plugin;
}
exports.registerPlugin = registerPlugin;
function unregisterPlugin(env, plugin) {
    env.hooks.deleteSource(plugin.meta.name);
    delete env.plugins[plugin.meta.name];
}
exports.unregisterPlugin = unregisterPlugin;
function loadPlugins(env) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const global = !env.meta.local;
        const modulesDir = path.resolve(global ? path.dirname(path.dirname(path.dirname(env.meta.libPath))) : path.join(env.project.directory, 'node_modules'));
        const pluginPkgs = yield Promise.all(exports.KNOWN_PLUGINS
            .map(formatFullPluginName)
            .map((pkgName) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const pluginPath = path.resolve(modulesDir, path.normalize(pkgName));
            const exists = yield fs_1.pathExists(pluginPath);
            return [pkgName, exists];
        })));
        const [, proxyVar] = http_1.getGlobalProxy();
        if (proxyVar) {
            const proxyPluginPkg = formatFullPluginName('proxy');
            env.log.debug(() => `Detected ${chalk.green(proxyVar)} in environment`);
            if (!pluginPkgs.find(v => v[0] === proxyPluginPkg && v[1])) {
                const canInstall = yield fs_1.pathAccessible(env.plugins.ionic.meta.filePath, fs.constants.W_OK);
                const proxyInstallArgs = yield npm_1.pkgManagerArgs(env, { pkg: proxyPluginPkg, global });
                const installMsg = `Detected ${chalk.green(proxyVar)} in environment, but to proxy CLI requests, you'll need ${chalk.cyan(proxyPluginPkg)} installed.`;
                if (canInstall) {
                    yield promptToInstallPlugin(env, proxyPluginPkg, {
                        message: `${installMsg} Install now?`,
                        reinstall: true,
                        global,
                    });
                }
                else {
                    env.log.warn(`${installMsg}\nYou can install it manually:\n\n${chalk.green(proxyInstallArgs.join(' '))}\n`);
                }
            }
        }
        const pluginPromises = pluginPkgs.map((pkg) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const [pkgName, exists] = pkg;
            if (exists) {
                try {
                    return yield loadPlugin(env, pkgName, { askToInstall: false, global });
                }
                catch (e) {
                    if (e !== exports.ERROR_PLUGIN_INVALID) {
                        throw e;
                    }
                }
            }
        }));
        for (let p of pluginPromises) {
            const plugin = yield p;
            if (plugin) {
                registerPlugin(env, plugin);
            }
        }
    });
}
exports.loadPlugins = loadPlugins;
function loadPlugin(env, pluginName, { message, askToInstall = true, reinstall = false, global = false }) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const config = yield env.config.load();
        const modulesDir = path.resolve(global ? path.dirname(path.dirname(path.dirname(env.meta.libPath))) : path.join(env.project.directory, 'node_modules'));
        let mResolvedPath;
        let m;
        if (!message) {
            message = `The plugin ${chalk.cyan(pluginName)} is not installed. Would you like to install it and continue?`;
        }
        env.log.debug(() => `Loading ${global ? 'global' : 'local'} plugin ${chalk.bold(pluginName)}`);
        try {
            mResolvedPath = require.resolve(path.resolve(modulesDir, pluginName));
            delete require.cache[mResolvedPath];
            m = require(mResolvedPath);
        }
        catch (e) {
            if (e.code !== 'MODULE_NOT_FOUND') {
                throw e;
            }
            if (!askToInstall) {
                env.log.debug(() => `${chalk.red(exports.ERROR_PLUGIN_NOT_INSTALLED)}: ${global ? 'global' : 'local'} ${chalk.bold(pluginName)}`);
                throw exports.ERROR_PLUGIN_NOT_INSTALLED;
            }
        }
        if (!m || reinstall) {
            const confirm = yield env.prompt({
                type: 'confirm',
                name: 'confirm',
                message,
            });
            if (confirm) {
                const [installer, ...installerArgs] = yield pkgInstallPluginArgs(env, pluginName, { global });
                yield env.shell.run(installer, installerArgs, {});
                m = yield loadPlugin(env, pluginName, { askToInstall: false, global });
                mResolvedPath = require.resolve(path.resolve(modulesDir, pluginName));
            }
            else {
                config.state.lastNoResponseToUpdate = new Date().toISOString();
                throw exports.ERROR_PLUGIN_NOT_INSTALLED;
            }
        }
        if (m.version || !guards_1.isPlugin(m) || !mResolvedPath) {
            env.log.debug(() => `${chalk.red(exports.ERROR_PLUGIN_INVALID)}: ${global ? 'global' : 'local'} ${chalk.bold(pluginName)}`);
            throw exports.ERROR_PLUGIN_INVALID;
        }
        const meta = yield getPluginMeta(mResolvedPath);
        m.meta = meta;
        if (config.daemon.updates) {
            const latestVersion = yield getLatestPluginVersion(env, meta.name, meta.version);
            env.log.debug(() => `Latest plugin version of ${chalk.bold(meta.name + (meta.distTag === 'latest' ? '' : '@' + meta.distTag))} is ${chalk.bold(latestVersion || 'unknown')}, according to daemon file.`);
            m.meta.latestVersion = latestVersion;
            m.meta.updateAvailable = latestVersion ? yield versionNeedsUpdating(meta.version, latestVersion) : undefined;
        }
        return m;
    });
}
exports.loadPlugin = loadPlugin;
function getPluginMeta(p) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const packageJson = yield npm_1.readPackageJsonFileOfResolvedModule(p);
        const name = packageJson.name;
        const version = packageJson.version || '';
        const distTag = determineDistTag(version);
        return {
            distTag,
            filePath: p,
            name,
            version,
        };
    });
}
exports.getPluginMeta = getPluginMeta;
function versionNeedsUpdating(version, latestVersion) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const semver = yield Promise.resolve().then(function () { return require('semver'); });
        const distTag = determineDistTag(version);
        return semver.gt(latestVersion, version) || (['canary', 'testing'].includes(distTag) && latestVersion !== version);
    });
}
exports.versionNeedsUpdating = versionNeedsUpdating;
function facilitateIonicUpdate(env, ionicPlugin, latestVersion) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const config = yield env.config.load();
        const global = !env.meta.local;
        const ionicInstallArgs = yield pkgInstallPluginArgs(env, 'ionic', { global });
        const updateMsg = `The Ionic CLI ${global ? '' : '(local version) '}has an update available (${chalk.cyan(ionicPlugin.meta.version)} => ${chalk.cyan(latestVersion)})!`;
        const canInstall = global ? yield fs_1.pathAccessible(ionicPlugin.meta.filePath, fs.constants.W_OK) : true;
        if (canInstall) {
            const confirm = yield env.prompt({
                name: 'confirm',
                type: 'confirm',
                message: `${updateMsg} Would you like to install it?`,
            });
            if (confirm) {
                const [installer, ...installerArgs] = ionicInstallArgs;
                yield env.shell.run(installer, installerArgs, {});
                const revertArgs = yield npm_1.pkgManagerArgs(env, { pkg: `ionic@${ionicPlugin.meta.version}`, global });
                env.log.nl();
                env.log.ok(`Updated Ionic CLI to ${chalk.bold(latestVersion)}! 🎉`);
                env.log.nl();
                env.log.msg(chalk.bold('Please re-run your command.'));
                env.log.nl();
                throw new errors_1.FatalException(`${chalk.bold('Note')}: You can downgrade to your old version by running: ${chalk.green(revertArgs.join(' '))}`, 0);
            }
            else {
                config.state.lastNoResponseToUpdate = new Date().toISOString();
                env.log.info(`Not automatically updating your CLI.`);
            }
        }
        else {
            env.log.info(updateMsg);
            env.log.nl();
            env.log.warn(`No write permissions for ${global ? 'global' : 'local'} ${chalk.bold('node_modules')}--automatic CLI updates are disabled.\n` +
                `To fix, see ${chalk.bold('https://docs.npmjs.com/getting-started/fixing-npm-permissions')}\n\n` +
                `Or, install the CLI update manually:\n\n${chalk.green(ionicInstallArgs.join(' '))}\n`);
        }
    });
}
function facilitatePluginUpdate(env, ionicPlugin, plugin, latestVersion) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const global = !env.meta.local;
        const startMsg = `${global ? 'Global' : 'Local'} plugin ${chalk.cyan(plugin.meta.name)}`;
        const updateMsg = `${startMsg} has an update available (${chalk.cyan(plugin.meta.version)} => ${chalk.cyan(latestVersion)})!`;
        const canInstall = global ? yield fs_1.pathAccessible(plugin.meta.filePath, fs.constants.W_OK) : true;
        if (canInstall) {
            const message = ionicPlugin.meta.distTag === plugin.meta.distTag ?
                `${updateMsg} Would you like to install it?` :
                `${startMsg} has a different dist-tag (${chalk.cyan('@' + plugin.meta.distTag)}) than the Ionic CLI (${chalk.cyan('@' + ionicPlugin.meta.distTag)}). Would you like to install the appropriate plugin version?`;
            const okmessage = ionicPlugin.meta.distTag === plugin.meta.distTag ?
                `Updated ${chalk.bold(plugin.meta.name)} to ${chalk.bold(latestVersion)}! 🎉` :
                `Installed ${chalk.bold(plugin.meta.name + '@' + ionicPlugin.meta.distTag)}`;
            const p = yield promptToInstallPlugin(env, plugin.meta.name, {
                message,
                reinstall: true,
                global,
            });
            if (p) {
                unregisterPlugin(env, plugin);
                registerPlugin(env, p);
                env.log.ok(okmessage);
                return true;
            }
            env.log.info(`Not automatically updating ${chalk.bold(plugin.meta.name)}.`);
        }
        else {
            env.log.info(updateMsg);
            env.log.nl();
            env.log.warn(`No write permissions for ${global ? 'global' : 'local'}${chalk.bold('node_modules')}--automatic plugin updates are disabled.\n` +
                `To fix, see ${chalk.bold('https://docs.npmjs.com/getting-started/fixing-npm-permissions')}\n`);
        }
        return false;
    });
}
function checkForUpdates(env) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const [config,] = yield Promise.all([env.config.load(), env.daemon.load()]);
        if (!config.daemon.updates) {
            return [];
        }
        yield env.daemon.save();
        if (env.plugins.ionic.meta.updateAvailable && env.plugins.ionic.meta.latestVersion) {
            yield facilitateIonicUpdate(env, env.plugins.ionic, env.plugins.ionic.meta.latestVersion);
        }
        const values = yield Promise.resolve().then(function () { return require('lodash/values'); });
        const plugins = values(env.plugins).filter(p => p !== env.plugins.ionic);
        const updates = [];
        for (let plugin of plugins) {
            // TODO: differing dist-tags?
            if ((yield env.config.isUpdatingEnabled()) && plugin.meta.updateAvailable && plugin.meta.latestVersion) {
                const installed = yield facilitatePluginUpdate(env, env.plugins.ionic, plugin, plugin.meta.latestVersion);
                if (installed) {
                    updates.push(plugin.meta.name);
                }
            }
        }
        if (updates.length > 0) {
            const [installer, ...dedupeArgs] = yield npm_1.pkgManagerArgs(env, { command: 'dedupe' });
            if (dedupeArgs.length > 0) {
                try {
                    yield env.shell.run(installer, dedupeArgs, { fatalOnError: false });
                }
                catch (e) {
                    env.log.warn('Error while deduping npm dependencies. Attempting to continue...');
                }
            }
        }
        return updates;
    });
}
exports.checkForUpdates = checkForUpdates;
function getLatestPluginVersion(env, name, version) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const daemon = yield env.daemon.load();
        const distTag = determineDistTag(version);
        if (typeof daemon.latestVersions[distTag] === 'object') {
            if (daemon.latestVersions[distTag][name]) {
                const version = daemon.latestVersions[distTag][name];
                return version;
            }
        }
        else {
            env.daemon.populateDistTag(distTag);
        }
    });
}
exports.getLatestPluginVersion = getLatestPluginVersion;
function pkgInstallPluginArgs(env, name, options = {}) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const releaseChannelName = determineDistTag(env.plugins.ionic.meta.version);
        let pluginInstallVersion = `${name}@${releaseChannelName}`;
        options.pkg = pluginInstallVersion;
        options.saveDev = true;
        return npm_1.pkgManagerArgs(env, options);
    });
}
exports.pkgInstallPluginArgs = pkgInstallPluginArgs;
function determineDistTag(version) {
    if (version.includes('-alpha')) {
        return 'canary';
    }
    if (version.includes('-testing')) {
        return 'testing';
    }
    return 'latest';
}
exports.determineDistTag = determineDistTag;
