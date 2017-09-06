"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function isValidEmail(email) {
    return EMAIL_REGEX.test(email);
}
exports.isValidEmail = isValidEmail;
function strcmp(a, b) {
    if (!a) {
        a = '';
    }
    if (!b) {
        b = '';
    }
    return +(a > b) || +(a === b) - 1;
}
exports.strcmp = strcmp;
