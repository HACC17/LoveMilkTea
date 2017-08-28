"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk = require("chalk");
class Environment {
    constructor({ bottomBar, client, config, daemon, events, flags, hooks, log, meta, namespace, plugins, project, prompt, session, shell, tasks, telemetry, }) {
        this.bottomBar = bottomBar;
        this.client = client;
        this.config = config;
        this.daemon = daemon;
        this.events = events;
        this.flags = flags;
        this.hooks = hooks;
        this.log = log;
        this.meta = meta;
        this.namespace = namespace;
        this.plugins = plugins;
        this.project = project;
        this.prompt = prompt;
        this.session = session;
        this.shell = shell;
        this.tasks = tasks;
        this.telemetry = telemetry;
    }
    load(p) {
        return require(p);
    }
    open() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this.flags.interactive) {
                if (!this.bottomBar) {
                    const inquirer = require('inquirer');
                    this.bottomBar = new inquirer.ui.BottomBar();
                }
                try {
                    // the mute() call appears to be necessary, otherwise when answering
                    // inquirer prompts upon pressing enter, a copy of the prompt is
                    // printed to the screen and looks gross
                    const bottomBarHack = this.bottomBar;
                    bottomBarHack.rl.output.mute();
                }
                catch (e) {
                    console.error('EXCEPTION DURING BOTTOMBAR OUTPUT MUTE', e);
                }
            }
            this.log.stream = typeof this.bottomBar === 'undefined' ? process.stdout : this.bottomBar.log;
        });
    }
    close() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.tasks.cleanup();
            // instantiating inquirer.ui.BottomBar hangs, so when close() is called,
            // we close BottomBar streams and replace the log stream with stdout.
            // This means inquirer shouldn't be used after command execution finishes
            // (which could happen during long-running processes like serve).
            if (this.bottomBar) {
                this.bottomBar.close();
                this.bottomBar = undefined;
                this.log.stream = process.stdout;
            }
        });
    }
    runcmd(pargv, opts = {}) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (typeof opts.showExecution === 'undefined') {
                opts.showExecution = true;
            }
            if (opts.showExecution) {
                this.log.msg(`> ${chalk.green([this.namespace.name, ...pargv].map(a => a.includes(' ') ? `"${a}"` : a).join(' '))}`);
            }
            yield this.namespace.runCommand(this, pargv);
        });
    }
}
exports.Environment = Environment;
