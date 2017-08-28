"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid = require("uuid");
function generateUUID() {
    return uuid.v4().toString();
}
exports.generateUUID = generateUUID;
