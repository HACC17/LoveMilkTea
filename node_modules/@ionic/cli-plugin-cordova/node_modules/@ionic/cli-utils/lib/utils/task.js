"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk = require("chalk");
const format_1 = require("./format");
class Spinner {
    constructor(frames = format_1.SPINNER_FRAMES) {
        this.frames = frames;
        this.i = 0;
    }
    frame() {
        return this.frames[this.i = ++this.i % this.frames.length];
    }
}
class Task {
    constructor({ msg, log }) {
        this.running = false;
        this.progressRatio = -1;
        this.msg = msg;
        this.log = log;
    }
    start() {
        this.running = true;
        return this;
    }
    progress(prog, total) {
        this.progressRatio = prog / total;
        return this;
    }
    clear() {
        return this;
    }
    end() {
        this.running = false;
        this.clear();
        return this;
    }
    succeed() {
        if (this.running) {
            this.end();
            if (this.log.shouldLog('info')) {
                this.log.msg(`${chalk.green(format_1.ICON_SUCCESS)} ${this.msg} - done!`);
            }
        }
        return this;
    }
    fail() {
        if (this.running) {
            this.end();
            if (this.log.shouldLog('info')) {
                this.log.msg(`${chalk.red(format_1.ICON_FAILURE)} ${this.msg} - failed!`);
            }
        }
        return this;
    }
}
class TaskChain {
    constructor({ log }) {
        this.log = log;
        this.tasks = [];
    }
    next(msg) {
        return this._next(new Task({ msg, log: this.log }));
    }
    _next(task) {
        if (this.currentTask) {
            this.currentTask.succeed();
        }
        this.tasks.push(task);
        this.currentTask = task;
        task.start();
        return task;
    }
    updateMsg(msg) {
        if (this.currentTask) {
            this.currentTask.msg = msg;
        }
        return this;
    }
    end() {
        if (this.currentTask) {
            this.currentTask.succeed();
            this.currentTask = undefined;
        }
        return this;
    }
    fail() {
        if (this.currentTask) {
            this.currentTask.fail();
        }
        return this;
    }
    cleanup() {
        for (let task of this.tasks) {
            if (task.running) {
                task.fail();
            }
            task.clear();
        }
        return this;
    }
}
exports.TaskChain = TaskChain;
class InteractiveTask extends Task {
    constructor({ msg, log, bottomBar }) {
        super({ msg, log });
        this.bottomBar = bottomBar;
        this.spinner = new Spinner();
    }
    start() {
        if (!this.running) {
            this.intervalId = setInterval(() => { this.tick(); }, 50);
        }
        super.start();
        return this;
    }
    tick() {
        if (this.log.shouldLog('info')) {
            this.bottomBar.updateBottomBar(this.format());
        }
        return this;
    }
    progress(prog, total) {
        super.progress(prog, total);
        this.tick();
        return this;
    }
    format() {
        const progress = this.progressRatio >= 0 ? (this.progressRatio * 100).toFixed(2) : '';
        const frame = this.spinner.frame();
        return `${chalk.bold(frame)} ${this.msg}${progress ? ' (' + chalk.bold(String(progress) + '%') + ')' : ''} `;
    }
    clear() {
        clearInterval(this.intervalId);
        if (this.log.shouldLog('info')) {
            this.bottomBar.updateBottomBar('');
        }
        return this;
    }
    end() {
        this.tick();
        super.end();
        return this;
    }
}
class InteractiveTaskChain extends TaskChain {
    constructor({ log, bottomBar }) {
        super({ log });
        this.bottomBar = bottomBar;
    }
    next(msg) {
        return this._next(new InteractiveTask({ msg, log: this.log, bottomBar: this.bottomBar }));
    }
}
exports.InteractiveTaskChain = InteractiveTaskChain;
