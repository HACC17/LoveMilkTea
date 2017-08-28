"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk = require("chalk");
const guards_1 = require("../guards");
const http_1 = require("./http");
const aws_1 = require("./utils/aws");
class PackageClient {
    constructor(appUserToken, client) {
        this.appUserToken = appUserToken;
        this.client = client;
    }
    getBuild(id, { fields = [] }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (fields.indexOf('url') === -1) {
                fields.push('url');
            }
            const req = this.client.make('GET', `/package/builds/${id}`)
                .set('Authorization', `Bearer ${this.appUserToken}`)
                .query({ fields })
                .send();
            const res = yield this.client.do(req);
            if (!guards_1.isPackageBuildResponse(res)) {
                throw http_1.createFatalAPIFormat(req, res);
            }
            return res.data;
        });
    }
    getBuilds({ page = 1, pageSize = 25 }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const req = this.client.make('GET', '/package/builds')
                .set('Authorization', `Bearer ${this.appUserToken}`)
                .query({ page, 'page_size': pageSize, })
                .send();
            const res = yield this.client.do(req);
            if (!guards_1.isPackageBuildsResponse(res)) {
                throw http_1.createFatalAPIFormat(req, res);
            }
            return res.data;
        });
    }
    queueBuild({ platform, mode, zipUrl, projectId, profileTag }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const req = this.client.make('POST', '/package/builds')
                .set('Authorization', `Bearer ${this.appUserToken}`)
                .send({
                platform,
                build_mode: mode,
                zip_url: zipUrl,
                project_id: projectId,
                security_profile_tag: profileTag,
            });
            const res = yield this.client.do(req);
            if (!guards_1.isPackageBuildResponse(res)) {
                throw http_1.createFatalAPIFormat(req, res);
            }
            return res.data;
        });
    }
    requestProjectUpload() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const req = this.client.make('POST', '/package/projects')
                .set('Authorization', `Bearer ${this.appUserToken}`)
                .send({});
            const res = yield this.client.do(req);
            if (!guards_1.isPackageProjectRequestResponse(res)) {
                throw http_1.createFatalAPIFormat(req, res);
            }
            return res.data;
        });
    }
    uploadProject(project, zip, { progress }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return aws_1.s3SignedUpload(project.presigned_post, zip, { progress });
        });
    }
    downloadBuild(build, dest, { progress }) {
        return new Promise((resolve, reject) => {
            if (build.status !== 'SUCCESS') {
                return reject(new Error(`Build must be 'SUCCESS', not '${build.status}'.`));
            }
            if (!build.url) {
                return reject(new Error('Build must have URL.'));
            }
            dest.on('error', (err) => {
                reject(err);
            });
            dest.on('close', () => {
                resolve();
            });
            http_1.createRequest('get', build.url)
                .on('response', (res) => {
                if (progress) {
                    let loaded = 0;
                    const total = Number(res.headers['content-length']);
                    res.on('data', (chunk) => {
                        loaded += chunk.length;
                        progress(loaded, total);
                    });
                }
            })
                .on('error', (err) => {
                reject(err);
            })
                .pipe(dest);
        });
    }
    colorStatus(s) {
        switch (s) {
            case 'SUCCESS':
                return chalk.green(s);
            case 'FAILED':
                return chalk.red(s);
        }
        return s;
    }
    formatFilename(build) {
        const extension = build.platform === 'android' ? 'apk' : 'ipa';
        return `${build.name}.${extension}`;
    }
    formatPlatform(p) {
        switch (p) {
            case 'ios':
                return 'iOS';
            case 'android':
                return 'Android';
        }
        return p;
    }
    formatBuildValues(build) {
        return {
            id: String(build.id),
            status: this.colorStatus(build.status),
            platform: this.formatPlatform(build.platform),
            mode: build.mode,
            security_profile_tag: build.security_profile_tag || '',
            created: new Date(build.created).toISOString(),
            completed: build.completed ? new Date(build.completed).toISOString() : '',
        };
    }
}
exports.PackageClient = PackageClient;
