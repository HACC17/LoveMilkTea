"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path = require("path");
const chalk = require("chalk");
const errors_1 = require("./errors");
const fs_1 = require("./utils/fs");
const promise_1 = require("./utils/promise");
let _gulpInst;
function loadGulp(env) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const { prettyPath } = yield Promise.resolve().then(function () { return require('./utils/format'); });
        const { pkgManagerArgs } = yield Promise.resolve().then(function () { return require('./utils/npm'); });
        const project = yield env.project.load();
        if (typeof project.integrations.gulp === 'undefined' || project.integrations.gulp.enabled === false) {
            throw new errors_1.FatalException('Not attempting to load gulp from a project with gulp integration disabled.');
        }
        const gulpFilePath = path.join(env.project.directory, project.integrations.gulp.file ? project.integrations.gulp.file : 'gulpfile.js');
        const gulpPath = path.join(env.project.directory, 'node_modules', 'gulp');
        try {
            _gulpInst = require(gulpPath);
        }
        catch (e) {
            if (e.code !== 'MODULE_NOT_FOUND') {
                throw e;
            }
            const gulpInstallArgs = yield pkgManagerArgs(env, { pkg: 'gulp', saveDev: true, saveExact: false });
            throw new errors_1.FatalException(`Gulp is not installed! You can install it locally:\n\n` +
                `    ${chalk.green(gulpInstallArgs.join(' '))}\n\n` +
                `Or, if you don't use gulp, you can disable it by running ${chalk.green('ionic config set gulp.enabled false')}.\n`);
        }
        try {
            require(gulpFilePath); // requiring the gulp file sets up the gulp instance with local gulp task definitions
        }
        catch (e) {
            if (e.code !== 'MODULE_NOT_FOUND') {
                throw e;
            }
            throw new errors_1.FatalException(`Gulpfile (or dependent module) not found: ${chalk.bold(prettyPath(gulpFilePath))}\n` +
                `For custom Gulpfile locations, you can run ${chalk.green('ionic config set gulp.file <path>')}. Otherwise, the default Ionic Gulpfile can be downloaded from ${chalk.bold('https://github.com/ionic-team/ionic-app-base/blob/master/gulpfile.js')}\n\n` +
                `Or, if you don't use gulp, you can disable it by running ${chalk.green('ionic config set gulp.enabled false')}.\n` +
                `Full error:\n\n` +
                chalk.red(e.stack ? e.stack : e));
        }
        return _gulpInst;
    });
}
exports.loadGulp = loadGulp;
function getGulpVersion() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const { getCommandInfo } = yield Promise.resolve().then(function () { return require('./utils/shell'); });
        let gulpVersion = yield getCommandInfo('gulp', ['--version']);
        if (gulpVersion) {
            gulpVersion = gulpVersion.replace(/\[[\d\:]+\]\s/g, '');
            gulpVersion = gulpVersion.trim();
        }
        return gulpVersion;
    });
}
exports.getGulpVersion = getGulpVersion;
function checkGulp(env) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const project = yield env.project.load();
        if (!project.integrations.gulp) {
            env.log.info('Enabling Gulp integration.');
            yield env.runcmd(['config', 'set', 'integrations.gulp', '{}', '--json', '--force']);
        }
    });
}
exports.checkGulp = checkGulp;
function runTask(env, name) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const project = yield env.project.load();
        if (project.integrations.gulp && project.integrations.gulp.enabled !== false) {
            const gulp = yield loadGulp(env);
            const gulpStart = promise_1.promisify(gulp.start.bind(gulp));
            if (gulp.hasTask(name)) {
                env.log.debug(() => `Invoking ${chalk.cyan(name)} gulp task.`);
                try {
                    yield gulpStart(name);
                }
                catch (e) {
                    env.log.error(`Error occurred during ${chalk.cyan(name)} gulp task. Use ${chalk.green('--verbose')} to show details.`);
                    throw e;
                }
            }
        }
    });
}
exports.runTask = runTask;
function registerWatchEvents(env) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const project = yield env.project.load();
        if (project.integrations.gulp && project.integrations.gulp.enabled !== false) {
            if (!project.watchPatterns) {
                project.watchPatterns = [];
            }
            if (!project.watchPatterns.includes('scss/**/*') && (yield fs_1.pathExists(path.join(env.project.directory, 'scss')))) {
                project.watchPatterns.push('scss/**/*');
            }
            const gulp = yield loadGulp(env);
            env.events.on('watch:init', () => tslib_1.__awaiter(this, void 0, void 0, function* () {
                if (!gulp.hasTask('sass')) {
                    env.log.warn(`The ${chalk.cyan('sass')} task not found in your Gulpfile, which is used to compile SCSS files. The default Ionic Gulpfile can be downloaded from ${chalk.bold('https://github.com/ionic-team/ionic-app-base/blob/master/gulpfile.js')}`);
                }
            }));
            env.events.on('watch:change', (filePath) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                if (path.extname(filePath) === '.scss') {
                    yield runTask(env, 'sass');
                }
            }));
        }
    });
}
exports.registerWatchEvents = registerWatchEvents;
