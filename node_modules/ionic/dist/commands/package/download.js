"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const cli_utils_1 = require("@ionic/cli-utils");
const command_1 = require("@ionic/cli-utils/lib/command");
let PackageDownloadCommand = class PackageDownloadCommand extends command_1.Command {
    run(inputs, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { PackageClient } = yield Promise.resolve().then(function () { return require('@ionic/cli-utils/lib/package'); });
            const { prettyPath } = yield Promise.resolve().then(function () { return require('@ionic/cli-utils/lib/utils/format'); });
            let [id] = inputs;
            let { destination } = options;
            const destDir = path.resolve(destination || this.env.project.directory);
            let buildId = isNaN(Number(id)) ? undefined : Number(id);
            const token = yield this.env.session.getAppUserToken();
            const pkg = new PackageClient(token, this.env.client);
            if (buildId) {
                this.env.tasks.next(`Retrieving information about build ${chalk.bold(String(buildId))}`);
            }
            else {
                this.env.tasks.next('Retrieving latest build information');
                const latestBuilds = yield pkg.getBuilds({ pageSize: 1 });
                if (latestBuilds.length === 0) {
                    this.env.tasks.end();
                    return this.env.log.warn(`You don't have any builds yet! Run ${chalk.green('ionic package build --help')} to learn how.`);
                }
                buildId = latestBuilds[0].id;
            }
            const build = yield pkg.getBuild(buildId, {});
            const buildFilename = path.join(destDir, pkg.formatFilename(build));
            this.env.tasks.end();
            const ws = fs.createWriteStream(buildFilename);
            const downloadTask = this.env.tasks.next(`Downloading build ${chalk.bold(String(build.id))}`);
            yield pkg.downloadBuild(build, ws, { progress: (loaded, total) => {
                    downloadTask.progress(loaded, total);
                } });
            this.env.tasks.end();
            this.env.log.ok(`Build ${chalk.bold(String(build.id))} downloaded as ${chalk.bold(prettyPath(buildFilename))}.`);
        });
    }
};
PackageDownloadCommand = tslib_1.__decorate([
    command_1.CommandMetadata({
        name: 'download',
        type: 'project',
        backends: [cli_utils_1.BACKEND_LEGACY],
        description: 'Download your packaged app',
        longDescription: `
Ionic Package makes it easy to build a native binary of your app in the cloud.

Full documentation can be found here: ${chalk.bold('https://docs.ionic.io/services/package/')}
  `,
        exampleCommands: ['', '15', '--destination=my-builds'],
        inputs: [
            {
                name: 'id',
                description: 'The build ID to download. Defaults to the latest build',
                required: false,
            },
        ],
        options: [
            {
                name: 'destination',
                description: 'The download destination directory',
                aliases: ['d'],
            },
        ],
    })
], PackageDownloadCommand);
exports.PackageDownloadCommand = PackageDownloadCommand;
