"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const os = require("os");
const array_1 = require("./array");
exports.ERROR_NETWORK_ADDRESS_NOT_AVAIL = 'NETWORK_ADDRESS_NOT_AVAIL';
function getAvailableIPAddresses() {
    let interfaces = os.networkInterfaces();
    return array_1.flattenArray(Object.keys(interfaces).map(deviceName => (interfaces[deviceName].map(item => ({
        address: item.address,
        deviceName,
        family: item.family,
        internal: item.internal
    })))))
        .filter(item => !item.internal && item.family === 'IPv4');
}
exports.getAvailableIPAddresses = getAvailableIPAddresses;
function findClosestOpenPort(port, host) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        function t(portToCheck) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                if (yield isPortAvailable(portToCheck, host)) {
                    return portToCheck;
                }
                return t(portToCheck + 1);
            });
        }
        return t(port);
    });
}
exports.findClosestOpenPort = findClosestOpenPort;
function isPortAvailable(port, host) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const net = yield Promise.resolve().then(function () { return require('net'); });
        return new Promise((resolve, reject) => {
            const tester = net.createServer()
                .once('error', (err) => {
                if (err.code === 'EADDRNOTAVAIL') {
                    reject(exports.ERROR_NETWORK_ADDRESS_NOT_AVAIL);
                }
                else if (err.code === 'EADDRINUSE') {
                    resolve(false); // host/port in use
                }
                else {
                    reject(err);
                }
            })
                .once('listening', () => {
                tester.once('close', () => {
                    resolve(true); // found available host/port
                })
                    .close();
            })
                .on('error', (err) => {
                reject(err);
            })
                .listen(port, host);
        });
    });
}
exports.isPortAvailable = isPortAvailable;
