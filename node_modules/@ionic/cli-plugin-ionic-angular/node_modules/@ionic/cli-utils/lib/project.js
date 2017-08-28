"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path = require("path");
const chalk = require("chalk");
const config_1 = require("./config");
const errors_1 = require("./errors");
const fs_1 = require("./utils/fs");
const npm_1 = require("./utils/npm");
const format_1 = require("./utils/format");
const modules_1 = require("./modules");
exports.PROJECT_FILE = 'ionic.config.json';
exports.PROJECT_FILE_LEGACY = 'ionic.project';
exports.PROJECT_TYPES = ['ionic-angular', 'ionic1'];
class Project extends config_1.BaseConfig {
    loadAppId() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const p = yield this.load();
            if (!p.app_id) {
                throw new errors_1.FatalException(`Your project file (${chalk.bold(format_1.prettyPath(this.filePath))}) does not contain '${chalk.bold('app_id')}'. `
                    + `Run ${chalk.green('ionic link')}.`);
            }
            return p.app_id;
        });
    }
    loadPackageJson() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!this.packageJsonFile) {
                const packageJsonPath = path.resolve(this.directory, 'package.json');
                try {
                    this.packageJsonFile = yield npm_1.readPackageJsonFile(packageJsonPath);
                }
                catch (e) {
                    if (e === fs_1.ERROR_FILE_INVALID_JSON) {
                        throw new errors_1.FatalException(`Could not parse ${chalk.bold('package.json')}. Is it a valid JSON file?`);
                    }
                    else if (e === npm_1.ERROR_INVALID_PACKAGE_JSON) {
                        throw new errors_1.FatalException(`The ${chalk.bold('package.json')} file seems malformed.`);
                    }
                    throw e; // Probably file not found
                }
            }
            return this.packageJsonFile;
        });
    }
    loadBowerJson() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!this.bowerJsonFile) {
                const bowerJsonPath = path.resolve(this.directory, 'bower.json');
                try {
                    this.bowerJsonFile = yield npm_1.readBowerJsonFile(bowerJsonPath);
                }
                catch (e) {
                    if (e === fs_1.ERROR_FILE_INVALID_JSON) {
                        throw new errors_1.FatalException(`Could not parse ${chalk.bold('bower.json')}. Is it a valid JSON file?`);
                    }
                    else if (e === npm_1.ERROR_INVALID_BOWER_JSON) {
                        throw new errors_1.FatalException(`The ${chalk.bold('bower.json')} file seems malformed.`);
                    }
                    throw e; // Probably file not found
                }
            }
            return this.bowerJsonFile;
        });
    }
    provideDefaults(o) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const lodash = modules_1.load('lodash');
            const results = lodash.cloneDeep(o);
            if (!results.name) {
                results.name = '';
            }
            if (!results.app_id) {
                results.app_id = '';
            }
            if (!results.type) {
                results.type = yield this.determineType();
            }
            delete results.projectTypeId;
            delete results.typescript;
            delete results.v2;
            return results;
        });
    }
    determineType() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const packageJson = yield this.loadPackageJson();
                if (packageJson.dependencies && typeof packageJson.dependencies['ionic-angular'] === 'string') {
                    return 'ionic-angular';
                }
            }
            catch (e) {
                if (e.fatal) {
                    throw e;
                }
            }
            try {
                const bowerJson = yield this.loadBowerJson();
                if ((bowerJson.dependencies && typeof bowerJson.dependencies['ionic'] === 'string') || (bowerJson.devDependencies && typeof bowerJson.devDependencies['ionic'] === 'string')) {
                    return 'ionic1';
                }
            }
            catch (e) {
                if (e.fatal) {
                    throw e;
                }
            }
            throw new errors_1.FatalException(`Could not determine project type (project config: ${chalk.bold(format_1.prettyPath(this.filePath))}).\n\n`
                + `For ${this.formatType('ionic-angular')} projects, make sure 'ionic-angular' exists in the ${chalk.bold('dependencies')} attribute of ${chalk.bold('package.json')}.\n`
                + `For ${this.formatType('ionic1')} projects, make sure 'ionic' exists in the ${chalk.bold('devDependencies')} attribute of ${chalk.bold('bower.json')}.\n\n`
                + `Alternatively, set ${chalk.bold('type')} attribute in ${chalk.bold('ionic.config.json')} to one of: ${exports.PROJECT_TYPES.map(v => '\'' + v + '\'').join(', ')}\n`);
        });
    }
    is(j) {
        return j && typeof j.name === 'string' && typeof j.app_id === 'string';
    }
    formatType(type) {
        if (type === 'ionic-angular') {
            return 'Ionic Angular';
        }
        else if (type === 'ionic1') {
            return 'Ionic 1';
        }
        return type;
    }
}
exports.Project = Project;
