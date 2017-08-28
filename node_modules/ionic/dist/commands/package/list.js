"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk = require("chalk");
const cli_utils_1 = require("@ionic/cli-utils");
const command_1 = require("@ionic/cli-utils/lib/command");
let PackageListCommand = class PackageListCommand extends command_1.Command {
    run(inputs, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { PackageClient } = yield Promise.resolve().then(function () { return require('@ionic/cli-utils/lib/package'); });
            const { columnar } = yield Promise.resolve().then(function () { return require('@ionic/cli-utils/lib/utils/format'); });
            const { json } = options;
            const token = yield this.env.session.getAppUserToken();
            const pkg = new PackageClient(token, this.env.client);
            if (!json) {
                this.env.tasks.next('Retrieving package builds');
            }
            const builds = yield pkg.getBuilds({});
            if (json) {
                process.stdout.write(JSON.stringify(builds));
            }
            else {
                if (builds.length === 0) {
                    this.env.tasks.end();
                    return this.env.log.warn(`You don't have any builds yet! Run ${chalk.green('ionic package build --help')} to learn how.`);
                }
                const attrs = ['id', 'status', 'platform', 'security_profile_tag', 'mode', 'created', 'completed'];
                const buildsMatrix = builds.map((build) => {
                    const formattedBuild = pkg.formatBuildValues(build);
                    return attrs.map(attr => formattedBuild[attr] || '');
                });
                const table = columnar(buildsMatrix, {
                    columnHeaders: attrs.map((attr) => {
                        if (attr === 'created') {
                            return 'started';
                        }
                        else if (attr === 'completed') {
                            return 'finished';
                        }
                        else if (attr === 'security_profile_tag') {
                            return 'profile';
                        }
                        return attr;
                    }),
                });
                this.env.tasks.end();
                this.env.log.nl();
                this.env.log.msg(table);
                this.env.log.nl();
                this.env.log.ok(`Showing ${chalk.bold(String(builds.length))} of your latest builds.`);
                this.env.log.nl();
            }
        });
    }
};
PackageListCommand = tslib_1.__decorate([
    command_1.CommandMetadata({
        name: 'list',
        type: 'project',
        backends: [cli_utils_1.BACKEND_LEGACY],
        description: 'List your cloud builds',
        longDescription: `
Ionic Package makes it easy to build a native binary of your app in the cloud.

Full documentation can be found here: ${chalk.bold('https://docs.ionic.io/services/package/')}
  `,
        options: [
            {
                name: 'json',
                description: 'Output cloud builds in JSON',
                type: Boolean,
            },
        ],
        exampleCommands: [''],
    })
], PackageListCommand);
exports.PackageListCommand = PackageListCommand;
