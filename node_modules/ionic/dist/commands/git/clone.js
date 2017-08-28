"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const cli_utils_1 = require("@ionic/cli-utils");
const command_1 = require("@ionic/cli-utils/lib/command");
const validators_1 = require("@ionic/cli-utils/lib/validators");
// import { formatGitRepoUrl } from '../../lib/git';
let GitCloneCommand = class GitCloneCommand extends command_1.Command {
    run(inputs, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            // let [ app_id, destination ] = inputs;
            // const appLoader = new App(await this.env.session.getAppUserToken(), this.env.client);
            // const app = await appLoader.load(app_id);
            // const remote = await formatGitRepoUrl(this.env.config, app.id);
            // if (!destination) {
            //   destination = app.slug ? app.slug : app.id;
            // }
            // destination = path.resolve(destination);
            // await this.env.shell.run('git', ['clone', '-o', 'ionic', remote, destination], { stdio: 'inherit' });
            // this.env.log.ok(`Your app has been cloned to ${chalk.bold(prettyPath(destination))}!`);
        });
    }
};
GitCloneCommand = tslib_1.__decorate([
    command_1.CommandMetadata({
        name: 'clone',
        type: 'global',
        backends: [cli_utils_1.BACKEND_PRO],
        description: 'Clones an Ionic app git repository to your computer',
        inputs: [
            {
                name: 'app-id',
                description: 'The App ID of the Ionic app to clone',
                validators: [validators_1.validators.required]
            },
            {
                name: 'path',
                description: 'The destination directory of the cloned app'
            }
        ],
        visible: false,
    })
], GitCloneCommand);
exports.GitCloneCommand = GitCloneCommand;
