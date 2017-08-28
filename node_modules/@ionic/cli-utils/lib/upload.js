"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path = require("path");
const chalk = require("chalk");
function upload(env, { note, channelTag, metadata }) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const { createArchive } = yield Promise.resolve().then(function () { return require('./utils/archive'); });
        const { DeployClient } = yield Promise.resolve().then(function () { return require('./deploy'); });
        let channel;
        const token = yield env.session.getAppUserToken();
        const deploy = new DeployClient(token, env.client);
        if (channelTag) {
            env.tasks.next('Retrieving deploy channel');
            channel = yield deploy.getChannel(channelTag);
        }
        const wwwPath = path.join(env.project.directory, 'www'); // TODO don't hardcode
        const zip = createArchive('zip');
        zip.directory(wwwPath, '/');
        zip.finalize();
        env.tasks.next('Requesting snapshot upload');
        const snapshot = yield deploy.requestSnapshotUpload({ note, user_metadata: metadata });
        const uploadTask = env.tasks.next('Uploading snapshot');
        yield deploy.uploadSnapshot(snapshot, zip, (loaded, total) => {
            uploadTask.progress(loaded, total);
        });
        env.tasks.end();
        env.log.ok(`Uploaded snapshot ${chalk.bold(snapshot.uuid)}!`);
        if (channel) {
            env.tasks.next(`Deploying to '${channel.tag}' channel`);
            yield deploy.deploy(snapshot.uuid, channel.uuid);
            env.tasks.end();
            env.log.ok(`Deployed snapshot ${chalk.bold(snapshot.uuid)} to channel ${chalk.bold(channel.tag)}!`);
        }
        return snapshot;
    });
}
exports.upload = upload;
