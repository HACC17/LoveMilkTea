"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const guards_1 = require("../guards");
const errors_1 = require("./errors");
const format_1 = require("./utils/format");
const fs_1 = require("./utils/fs");
const http_1 = require("./http");
const npm_1 = require("./utils/npm");
exports.KNOWN_COMMAND_PLUGINS = ['cordova'];
exports.KNOWN_GLOBAL_PLUGINS = ['proxy'];
exports.KNOWN_PROJECT_PLUGINS = ['ionic1', 'ionic-angular'];
exports.ORG_PREFIX = '@ionic';
exports.PLUGIN_PREFIX = 'cli-plugin-';
exports.ERROR_PLUGIN_NOT_INSTALLED = 'PLUGIN_NOT_INSTALLED';
exports.ERROR_PLUGIN_NOT_FOUND = 'PLUGIN_NOT_FOUND';
exports.ERROR_PLUGIN_INVALID = 'PLUGIN_INVALID';
function formatFullPluginName(name) {
    return `${exports.ORG_PREFIX}/${exports.PLUGIN_PREFIX}${name}`;
}
exports.formatFullPluginName = formatFullPluginName;
function promptToInstallProjectPlugin(env, { message }) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const project = yield env.project.load();
        const projectPlugin = formatFullPluginName(project.type);
        if (!message) {
            message = `Looks like this is an ${env.project.formatType(project.type)} project, would you like to install ${chalk.green(projectPlugin)} and continue?`;
        }
        return yield promptToInstallPlugin(env, projectPlugin, { message });
    });
}
exports.promptToInstallProjectPlugin = promptToInstallProjectPlugin;
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
    const ns = plugin.namespace;
    if (ns) {
        env.namespace.namespaces.set(ns.name, () => ns);
    }
    if (plugin.registerHooks) {
        plugin.registerHooks(env.hooks);
    }
    env.plugins[plugin.name] = plugin;
}
exports.registerPlugin = registerPlugin;
function unregisterPlugin(env, plugin) {
    if (plugin.namespace) {
        env.namespace.namespaces.delete(plugin.namespace.name);
    }
    env.hooks.deleteSource(plugin.name);
    delete env.plugins[plugin.name];
}
exports.unregisterPlugin = unregisterPlugin;
function loadPlugins(env) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        // GLOBAL PLUGINS
        const global = !env.meta || !env.meta.local;
        const globalPluginPkgs = exports.KNOWN_GLOBAL_PLUGINS.map(formatFullPluginName);
        const globalPluginPromises = globalPluginPkgs.map((pkgName) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                return yield loadPlugin(env, pkgName, { askToInstall: false, global });
            }
            catch (e) {
                if (e !== exports.ERROR_PLUGIN_NOT_INSTALLED) {
                    throw e;
                }
            }
        }));
        for (let p of globalPluginPromises) {
            const plugin = yield p;
            if (plugin) {
                registerPlugin(env, plugin);
            }
        }
        const [, proxyVar] = http_1.getGlobalProxy();
        if (!env.project.directory) {
            return;
        }
        const project = yield env.project.load();
        // LOCAL PLUGINS
        const ionicModulePath = path.join(env.project.directory, 'node_modules', 'ionic');
        const gulpFilePath = path.join(env.project.directory, project.gulpFile || 'gulpfile.js');
        const mPath = path.join(env.project.directory, 'node_modules', '@ionic');
        const [ionicModuleExists, gulpFileExists, ionicModules] = yield Promise.all([
            fs_1.pathExists(ionicModulePath),
            fs_1.pathExists(gulpFilePath),
            fs_1.readDir(mPath),
        ]);
        if (!ionicModuleExists) {
            // TODO: remove "starting with 3.6"
            env.log.warn(chalk.yellow(chalk.bold('No local CLI detected.\n') +
                'Starting with CLI 3.6, the CLI must be installed locally to use local CLI plugins.\n'));
            const p = yield promptToInstallPlugin(env, 'ionic', {
                message: 'Install now?',
            });
            if (p) {
                env.log.ok('Installed Ionic CLI locally!');
                env.log.nl();
                throw new errors_1.FatalException(`${chalk.bold('Please re-run your command.')}`, 0);
            }
            else {
                env.log.warn('Not loading local CLI plugins in global mode. CLI functionality may be limited.');
                return;
            }
        }
        if (proxyVar) {
            const proxyPluginPkg = formatFullPluginName('proxy');
            env.log.debug(() => `Detected ${chalk.green(proxyVar)} in environment`);
            if (!(proxyPluginPkg in env.plugins)) {
                const meta = env.plugins.ionic.meta;
                if (!meta) {
                    throw new errors_1.FatalException(`${chalk.green('ionic')} missing meta information`);
                }
                const canInstall = yield fs_1.pathAccessible(meta.filePath, fs.constants.W_OK);
                const proxyInstallArgs = yield npm_1.pkgManagerArgs(env, { pkg: proxyPluginPkg, global });
                const installMsg = `Detected ${chalk.green(proxyVar)} in environment, but to proxy CLI requests, you'll need ${chalk.green(proxyPluginPkg)} installed.`;
                if (canInstall) {
                    const p = yield promptToInstallPlugin(env, proxyPluginPkg, {
                        message: `${installMsg} Install now?`,
                        reinstall: true,
                        global,
                    });
                    if (p) {
                        registerPlugin(env, p);
                    }
                }
                else {
                    env.log.warn(`${installMsg}\nYou can install it manually:\n\n${chalk.green(proxyInstallArgs.join(' '))}\n`);
                }
            }
        }
        const plugins = [];
        const pluginPkgs = ionicModules
            .filter(pkgName => pkgName.indexOf(exports.PLUGIN_PREFIX) === 0)
            .map(pkgName => `${exports.ORG_PREFIX}/${pkgName}`)
            .filter(pkgName => !exports.KNOWN_GLOBAL_PLUGINS.map(formatFullPluginName).includes(pkgName)); // already loaded these in global section above
        const gulpPluginPkg = formatFullPluginName('gulp');
        if (gulpFileExists) {
            env.log.debug(() => `Detected ${chalk.green(format_1.prettyPath(gulpFilePath))} in project directory`);
            if (!pluginPkgs.includes(gulpPluginPkg)) {
                const installMsg = `Detected ${chalk.green(format_1.prettyPath(gulpFilePath))} in project directory, but to integrate gulp with the CLI, you'll need to install ${chalk.green(gulpPluginPkg)}.`;
                const p = yield promptToInstallPlugin(env, gulpPluginPkg, {
                    message: `${installMsg} Install now?`,
                    reinstall: true,
                });
                if (p) {
                    plugins.push(p);
                }
            }
        }
        const pluginPromises = pluginPkgs.map(pkgName => {
            return loadPlugin(env, pkgName, { askToInstall: false });
        });
        for (let p of pluginPromises) {
            const plugin = yield p;
            plugins.push(plugin);
        }
        // TODO: remember the responses of the requests below
        const projectPlugin = formatFullPluginName(project.type);
        if (!pluginPkgs.includes(projectPlugin)) {
            const plugin = yield promptToInstallProjectPlugin(env, {});
            if (plugin) {
                plugins.push(plugin);
            }
        }
        for (let plugin of plugins) {
            registerPlugin(env, plugin);
        }
        validatePlugins(env);
    });
}
exports.loadPlugins = loadPlugins;
function validatePlugins(env) {
    const projectPlugins = new Set(exports.KNOWN_PROJECT_PLUGINS.map(formatFullPluginName));
    const installedPlugins = new Set(Object.keys(env.plugins));
    const installedProjectPlugins = new Set([...projectPlugins].filter(p => installedPlugins.has(p)));
    if (installedProjectPlugins.size === 0) {
        env.log.warn('You have no CLI project plugins installed. CLI functionality may be limited.');
    }
    else if (installedProjectPlugins.size > 1) {
        env.log.warn(`You have multiple CLI project plugins installed (${[...installedProjectPlugins].map(p => chalk.green(p)).join(', ')}). ${chalk.bold('Please make sure you have only one installed.')}`);
    }
}
exports.validatePlugins = validatePlugins;
function loadPlugin(env, pluginName, { message, askToInstall = true, reinstall = false, global = false }) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const mPath = global ? pluginName : path.join(env.project.directory, 'node_modules', ...pluginName.split('/'));
        let mResolvedPath;
        let m;
        if (!message) {
            message = `The plugin ${chalk.green(pluginName)} is not installed. Would you like to install it and continue?`;
        }
        env.log.debug(() => `Loading ${global ? 'global' : 'local'} plugin ${chalk.green(pluginName)}`);
        try {
            mResolvedPath = require.resolve(mPath);
            delete require.cache[mResolvedPath];
            m = require(mResolvedPath);
        }
        catch (e) {
            if (e.code !== 'MODULE_NOT_FOUND') {
                throw e;
            }
            if (!askToInstall) {
                env.log.debug(() => `Throwing ${chalk.red(exports.ERROR_PLUGIN_NOT_INSTALLED)} for ${global ? 'global' : 'local'} ${chalk.green(pluginName)}`);
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
                mResolvedPath = require.resolve(mPath);
            }
            else {
                throw exports.ERROR_PLUGIN_NOT_INSTALLED;
            }
        }
        if (!guards_1.isPlugin(m) || !mResolvedPath) {
            env.log.debug(() => `Throwing ${chalk.red(exports.ERROR_PLUGIN_INVALID)} for ${global ? 'global' : 'local'} ${chalk.green(pluginName)}`);
            throw exports.ERROR_PLUGIN_INVALID;
        }
        m.meta = {
            filePath: mResolvedPath,
        };
        return m;
    });
}
exports.loadPlugin = loadPlugin;
function hydratePlugin(env, plugin) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        env.log.debug(() => `Getting plugin info for ${chalk.green(plugin.name)}`);
        const currentVersion = plugin.version;
        const latestVersion = yield getLatestPluginVersion(env, plugin);
        const distTag = determineDistTag(currentVersion);
        const meta = plugin.meta;
        if (!meta) {
            throw new errors_1.FatalException(`${chalk.green(plugin.name)} missing meta information`);
        }
        return Object.assign({}, plugin, { meta,
            distTag,
            currentVersion,
            latestVersion, updateAvailable: yield pluginHasUpdate(currentVersion, latestVersion) });
    });
}
function pluginHasUpdate(currentVersion, latestVersion) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const semver = yield Promise.resolve().then(function () { return require('semver'); });
        const distTag = determineDistTag(currentVersion);
        return semver.gt(latestVersion, currentVersion) || ('canary' === distTag && latestVersion !== currentVersion);
    });
}
exports.pluginHasUpdate = pluginHasUpdate;
function facilitateIonicUpdate(env, ionicPlugin) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const global = !env.meta || !env.meta.local;
        const ionicInstallArgs = yield pkgInstallPluginArgs(env, 'ionic', { global });
        const updateMsg = `The Ionic CLI ${global ? '' : '(local version) '}has an update available (${chalk.green(ionicPlugin.currentVersion)} => ${chalk.green(ionicPlugin.latestVersion)})!`;
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
                const revertArgs = yield npm_1.pkgManagerArgs(env, { pkg: `ionic@${ionicPlugin.currentVersion}`, global });
                env.log.nl();
                env.log.ok(`Updated Ionic CLI to ${chalk.green(ionicPlugin.latestVersion)}! 🎉`);
                env.log.nl();
                env.log.msg(chalk.bold('Please re-run your command.'));
                env.log.nl();
                throw new errors_1.FatalException(`${chalk.bold('Note')}: You can downgrade to your old version by running: ${chalk.green(revertArgs.join(' '))}`, 0);
            }
            else {
                env.log.info(`Not automatically updating your CLI. You can update manually:\n\n${chalk.green(ionicInstallArgs.join(' '))}\n`);
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
function facilitatePluginUpdate(env, ionicPlugin, plugin) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const global = !env.meta || !env.meta.local;
        const pluginInstallArgs = yield pkgInstallPluginArgs(env, plugin.name, { global });
        const startMsg = `${global ? 'Global' : 'Local'} plugin ${chalk.green(plugin.name)}`;
        const updateMsg = `${startMsg} has an update available (${chalk.green(plugin.currentVersion)} => ${chalk.green(plugin.latestVersion)})!`;
        const canInstall = global ? yield fs_1.pathAccessible(plugin.meta.filePath, fs.constants.W_OK) : true;
        if (canInstall) {
            const message = ionicPlugin.distTag === plugin.distTag ?
                `${updateMsg} Would you like to install it?` :
                `${startMsg} has a different dist-tag (${chalk.green('@' + plugin.distTag)}) than the Ionic CLI (${chalk.green('@' + ionicPlugin.distTag)}). Would you like to install the appropriate plugin version?`;
            const okmessage = ionicPlugin.distTag === plugin.distTag ?
                `Updated ${chalk.green(plugin.name)} to ${chalk.green(plugin.latestVersion)}! 🎉` :
                `Installed ${chalk.green(plugin.name + '@' + ionicPlugin.distTag)}`;
            const p = yield promptToInstallPlugin(env, plugin.name, {
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
            env.log.info(`Not automatically updating ${chalk.green(plugin.name)}. You can update manually:\n\n${chalk.green(pluginInstallArgs.join(' '))}\n`);
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
        const allPlugins = yield Promise.all(Object.keys(env.plugins).map(n => hydratePlugin(env, env.plugins[n])));
        yield env.daemon.save();
        const ionicPlugin = allPlugins.find(p => p.name === 'ionic');
        if (!ionicPlugin) {
            throw new errors_1.FatalException('Ionic plugin not initialized.');
        }
        if (ionicPlugin.updateAvailable) {
            yield facilitateIonicUpdate(env, ionicPlugin);
        }
        const plugins = allPlugins.filter(p => p.name !== 'ionic');
        const updates = [];
        for (let plugin of plugins) {
            if (plugin.updateAvailable || ionicPlugin.distTag !== plugin.distTag) {
                const installed = yield facilitatePluginUpdate(env, ionicPlugin, plugin);
                if (installed) {
                    updates.push(plugin.name);
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
function getLatestPluginVersion(env, plugin) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const distTag = determineDistTag(plugin.version);
        if (distTag === 'local') {
            return plugin.version;
        }
        env.log.debug(() => `Checking for latest plugin version of ${chalk.green(plugin.name + '@' + distTag)}.`);
        const daemon = yield env.daemon.load();
        if (typeof daemon.latestVersions[distTag] === 'object') {
            if (daemon.latestVersions[distTag][plugin.name]) {
                return daemon.latestVersions[distTag][plugin.name];
            }
        }
        else {
            env.daemon.populateDistTag(distTag);
        }
        let latestVersion = yield npm_1.pkgLatestVersion(env, plugin.name, distTag);
        if (!latestVersion) {
            latestVersion = plugin.version;
        }
        latestVersion = latestVersion.trim();
        env.log.debug(`Latest version of ${chalk.green(plugin.name + '@' + distTag)} is ${latestVersion}.`);
        daemon.latestVersions[distTag][plugin.name] = latestVersion;
        return latestVersion;
    });
}
function pkgInstallPluginArgs(env, name, options = {}) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const releaseChannelName = determineDistTag(env.plugins.ionic.version);
        let pluginInstallVersion = `${name}@${releaseChannelName}`;
        if (releaseChannelName === 'local') {
            options.link = true;
            pluginInstallVersion = name;
        }
        options.pkg = pluginInstallVersion;
        options.saveDev = true;
        return npm_1.pkgManagerArgs(env, options);
    });
}
exports.pkgInstallPluginArgs = pkgInstallPluginArgs;
function determineDistTag(version) {
    if (version.includes('-local')) {
        return 'local';
    }
    if (version.includes('-alpha')) {
        return 'canary';
    }
    if (version.includes('-beta') || version.includes('-rc')) {
        return 'beta';
    }
    return 'latest';
}
exports.determineDistTag = determineDistTag;
