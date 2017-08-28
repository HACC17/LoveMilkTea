"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const archiver = require("archiver");
const http_1 = require("./http");
function createArchive(format) {
    return archiver(format);
}
exports.createArchive = createArchive;
function tarXvfFromUrl(url, destination, { progress }) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const archiveRequest = http_1.createRequest('get', url)
                .on('response', (res) => {
                if (res.statusCode !== 200) {
                    reject(new Error(`Encountered bad status code (${res.statusCode}) for ${url}\n` +
                        `This could mean the server is experiencing difficulties right now--please try again later.\n\n` +
                        `If you're behind a firewall, you can proxy requests by using the HTTP_PROXY or IONIC_HTTP_PROXY environment variables.`));
                }
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
                if (err.code === 'ECONNABORTED') {
                    reject(new Error(`Timeout of ${err.timeout}ms reached for ${url}`));
                }
                else {
                    reject(err);
                }
            });
            tarXvf(archiveRequest, destination).then(resolve, reject);
        });
    });
}
exports.tarXvfFromUrl = tarXvfFromUrl;
function tarXvf(readStream, destination) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const [zlib, tar] = yield Promise.all([Promise.resolve().then(function () { return require('zlib'); }), Promise.resolve().then(function () { return require('tar'); })]);
        return new Promise((resolve, reject) => {
            const baseArchiveExtract = tar.Extract({
                path: destination,
                strip: 1
            })
                .on('error', reject)
                .on('end', resolve);
            try {
                readStream
                    .on('error', reject)
                    .pipe(zlib.createUnzip())
                    .pipe(baseArchiveExtract);
            }
            catch (e) {
                reject(e);
            }
        });
    });
}
