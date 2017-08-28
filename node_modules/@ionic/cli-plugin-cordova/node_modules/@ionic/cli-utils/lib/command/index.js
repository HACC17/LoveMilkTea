"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function CommandMetadata(metadata) {
    return function (target) {
        target.prototype.metadata = metadata;
    };
}
exports.CommandMetadata = CommandMetadata;
