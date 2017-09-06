"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const util = require("util");
const path = require("path");
const ci_info_1 = require("ci-info");
const chalk = require("chalk");
const minimist = require("minimist");
const guards_1 = require("./guards");
const backends_1 = require("./lib/backends");
const config_1 = require("./lib/config");
const daemon_1 = require("./lib/daemon");
const http_1 = require("./lib/http");
const events_1 = require("./lib/events");
const environment_1 = require("./lib/environment");
const hooks_1 = require("./lib/hooks");
const project_1 = require("./lib/project");
const logger_1 = require("./lib/utils/logger");
const fs_1 = require("./lib/utils/fs");
const task_1 = require("./lib/utils/task");
const telemetry_1 = require("./lib/telemetry");
const session_1 = require("./lib/session");
const shell_1 = require("./lib/shell");
const prompts_1 = require("./lib/prompts");
tslib_1.__exportStar(require("./guards"), exports);
tslib_1.__exportStar(require("./lib/app"), exports);
tslib_1.__exportStar(require("./lib/backends"), exports);
tslib_1.__exportStar(require("./lib/command"), exports);
tslib_1.__exportStar(require("./lib/command/command"), exports);
tslib_1.__exportStar(require("./lib/command/namespace"), exports);
tslib_1.__exportStar(require("./lib/command/utils"), exports);
tslib_1.__exportStar(require("./lib/config"), exports);
tslib_1.__exportStar(require("./lib/daemon"), exports);
tslib_1.__exportStar(require("./lib/deploy"), exports);
tslib_1.__exportStar(require("./lib/errors"), exports);
tslib_1.__exportStar(require("./lib/events"), exports);
tslib_1.__exportStar(require("./lib/help"), exports);
tslib_1.__exportStar(require("./lib/hooks"), exports);
tslib_1.__exportStar(require("./lib/http"), exports);
tslib_1.__exportStar(require("./lib/login"), exports);
tslib_1.__exportStar(require("./lib/package"), exports);
tslib_1.__exportStar(require("./lib/plugins"), exports);
tslib_1.__exportStar(require("./lib/project"), exports);
tslib_1.__exportStar(require("./lib/prompts"), exports);
tslib_1.__exportStar(require("./lib/security"), exports);
tslib_1.__exportStar(require("./lib/session"), exports);
tslib_1.__exportStar(require("./lib/shell"), exports);
tslib_1.__exportStar(require("./lib/telemetry"), exports);
tslib_1.__exportStar(require("./lib/utils/archive"), exports);
tslib_1.__exportStar(require("./lib/utils/array"), exports);
tslib_1.__exportStar(require("./lib/utils/environmentInfo"), exports);
tslib_1.__exportStar(require("./lib/utils/format"), exports);
tslib_1.__exportStar(require("./lib/utils/fs"), exports);
tslib_1.__exportStar(require("./lib/utils/logger"), exports);
tslib_1.__exportStar(require("./lib/utils/network"), exports);
tslib_1.__exportStar(require("./lib/utils/npm"), exports);
tslib_1.__exportStar(require("./lib/utils/promise"), exports);
tslib_1.__exportStar(require("./lib/utils/string"), exports);
tslib_1.__exportStar(require("./lib/utils/task"), exports);
tslib_1.__exportStar(require("./lib/validators"), exports);
exports.name = '@ionic/cli-utils';
exports.version = '1.7.0';
function registerHooks(hooks) {
    hooks.register(exports.name, 'command:info', () => tslib_1.__awaiter(this, void 0, void 0, function* () {
        return [
            { type: 'cli-packages', name: exports.name, version: exports.version, path: path.dirname(__filename) },
        ];
    }));
    hooks.register(exports.name, 'command:config:set', ({ env, inputs, options, valueChanged }) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        let [p] = inputs;
        const { global } = options;
        if (global && p === 'backend' && valueChanged) {
            yield hooks.fire('backend:changed', { env });
        }
    }));
    hooks.register(exports.name, 'backend:changed', ({ env }) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        const config = yield env.config.load();
        if (config.backend === backends_1.BACKEND_PRO) {
            config.urls.api = 'https://api.ionicjs.com';
            config.urls.dash = 'https://dashboard.ionicjs.com';
        }
        else if (config.backend === backends_1.BACKEND_LEGACY) {
            config.urls.api = 'https://api.ionic.io';
            config.urls.dash = 'https://apps.ionic.io';
        }
        const wasLoggedIn = yield env.session.isLoggedIn();
        yield env.session.logout();
        env.client.host = config.urls.api;
        env.session = yield getSession(env.config, env.project, env.client);
        if (wasLoggedIn) {
            env.log.info('You have been logged out.');
        }
    }));
}
exports.registerHooks = registerHooks;
function getSession(config, project, client) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const configData = yield config.load();
        return configData.backend === backends_1.BACKEND_LEGACY ? new session_1.CloudSession(config, project, client) : new session_1.ProSession(config, project, client);
    });
}
function generateIonicEnvironment(plugin, pargv, env) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const cwd = process.cwd();
        const argv = minimist(pargv, { boolean: true, string: '_' });
        const config = new config_1.Config(env['IONIC_CONFIG_DIRECTORY'] || config_1.CONFIG_DIRECTORY, config_1.CONFIG_FILE);
        const configData = yield config.load();
        const flags = config_1.gatherFlags(argv);
        let stream;
        let tasks;
        let bottomBar;
        let log;
        let level = 'info';
        let levelInvalid = false;
        let prefix = '';
        if (ci_info_1.isCI) {
            flags.interactive = false;
        }
        if (argv['log-level']) {
            if (guards_1.isLogLevel(argv['log-level'])) {
                level = argv['log-level'];
            }
            else {
                levelInvalid = true;
            }
        }
        if (argv['log-timestamps']) {
            prefix = () => `${chalk.dim('[' + new Date().toISOString() + ']')}`;
        }
        if (flags.interactive) {
            const inquirer = yield Promise.resolve().then(function () { return require('inquirer'); });
            bottomBar = new inquirer.ui.BottomBar();
            stream = bottomBar.log;
            log = new logger_1.Logger({ level, prefix, stream });
            tasks = new task_1.InteractiveTaskChain({ log, bottomBar });
        }
        else {
            stream = process.stdout;
            log = new logger_1.Logger({ level, prefix, stream });
            tasks = new task_1.TaskChain({ log });
        }
        const projectDir = yield fs_1.findBaseDirectory(cwd, project_1.PROJECT_FILE);
        env['IONIC_PROJECT_DIR'] = projectDir || '';
        env['IONIC_PROJECT_FILE'] = project_1.PROJECT_FILE;
        const project = new project_1.Project(env['IONIC_PROJECT_DIR'], project_1.PROJECT_FILE);
        const client = new http_1.Client(configData.urls.api);
        const session = yield getSession(config, project, client);
        const hooks = new hooks_1.HookEngine();
        const telemetry = new telemetry_1.Telemetry({ config, client, plugin, project, session });
        const shell = new shell_1.Shell(tasks, log);
        registerHooks(hooks);
        const ienv = new environment_1.Environment({
            bottomBar,
            client,
            config,
            daemon: new daemon_1.Daemon(config_1.CONFIG_DIRECTORY, daemon_1.DAEMON_JSON_FILE),
            events: new events_1.CLIEventEmitter(),
            flags,
            hooks,
            log,
            meta: {
                cwd,
                local: env['IONIC_CLI_LOCAL'] ? true : false,
                binPath: env['IONIC_CLI_BIN'],
                libPath: env['IONIC_CLI_LIB'],
            },
            namespace: plugin.namespace,
            plugins: {
                ionic: plugin,
            },
            prompt: yield prompts_1.createPromptModule({ confirm: flags.confirm, interactive: flags.interactive, log, config }),
            project,
            session,
            shell,
            tasks,
            telemetry,
        });
        ienv.open();
        if (levelInvalid) {
            log.warn(`${chalk.green(argv['log-level'])} is an invalid log level--defaulting back to ${chalk.bold(level)}.\n` +
                `You can choose from the following log levels: ${guards_1.LOG_LEVELS.map(l => chalk.bold(l)).join(', ')}.`);
        }
        log.debug(`CLI flags: ${util.inspect(flags, { breakLength: Infinity, colors: chalk.enabled })}`);
        if (typeof argv['yarn'] === 'boolean') {
            log.warn(`${chalk.green('--yarn')} / ${chalk.green('--no-yarn')} switch is deprecated. Use ${chalk.green('ionic config set -g yarn ' + String(argv['yarn']))}.`);
            configData.yarn = argv['yarn'];
        }
        if (!projectDir) {
            const foundDir = yield fs_1.findBaseDirectory(cwd, project_1.PROJECT_FILE_LEGACY);
            if (foundDir) {
                log.warn(`${chalk.bold(project_1.PROJECT_FILE_LEGACY)} file found in ${chalk.bold(foundDir)}--please rename it to ${chalk.bold(project_1.PROJECT_FILE)}, or your project directory will not be detected!`);
            }
        }
        return ienv;
    });
}
exports.generateIonicEnvironment = generateIonicEnvironment;
