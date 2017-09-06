"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const modules_1 = require("../modules");
function createArchive(format) {
    const archiver = modules_1.load('archiver');
    return archiver(format);
}
exports.createArchive = createArchive;
