"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk = require("chalk");
const cli_utils_1 = require("@ionic/cli-utils");
const command_1 = require("@ionic/cli-utils/lib/command");
let UploadCommand = class UploadCommand extends command_1.Command {
    resolveNote(input) {
        if (typeof input !== 'string') {
            input = undefined;
        }
        return input;
    }
    resolveMetaData(input) {
        if (typeof input !== 'string') {
            input = undefined;
        }
        return input ? JSON.parse(input) : undefined;
    }
    resolveChannelTag(input) {
        if (typeof input !== 'string') {
            input = undefined;
        }
        else if (input === '') {
            input = 'dev';
        }
        return input;
    }
    run(inputs, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { upload } = yield Promise.resolve().then(function () { return require('@ionic/cli-utils/lib/upload'); });
            const note = this.resolveNote(options['note']);
            const channelTag = this.resolveChannelTag(options['deploy']);
            const metadata = this.resolveMetaData(options['metadata']);
            if (!options['nobuild']) {
                const { build } = yield Promise.resolve().then(function () { return require('@ionic/cli-utils/commands/build'); });
                yield build(this.env, inputs, options);
            }
            yield upload(this.env, { note, channelTag, metadata });
        });
    }
};
UploadCommand = tslib_1.__decorate([
    command_1.CommandMetadata({
        name: 'upload',
        type: 'project',
        backends: [cli_utils_1.BACKEND_LEGACY],
        description: 'Upload a new snapshot of your app',
        longDescription: `
Zips up your local app files and uploads a snapshot to Ionic.

From there, you can use Ionic View (${chalk.bold('https://view.ionic.io')}) to easily share your app with your organization and testers around the world.
  `,
        exampleCommands: [
            '',
            '--deploy=dev',
            `--deploy=production --note="add menu entry" --metadata="{\\"custom_data\\":true}"`,
        ],
        options: [
            {
                name: 'note',
                description: 'Give this snapshot a nice description',
            },
            {
                name: 'deploy',
                description: 'Deploys this snapshot to the given channel',
            },
            {
                name: 'metadata',
                description: 'Set custom metadata JSON for the deploy',
            },
            {
                name: 'nobuild',
                description: 'Do not invoke a build for this snapshot',
                type: Boolean,
            },
        ],
    })
], UploadCommand);
exports.UploadCommand = UploadCommand;
