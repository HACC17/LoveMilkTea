"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function isValidEmail(email) {
    if (typeof email !== 'string') {
        return false;
    }
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
function str2num(value, defaultValue = -1) {
    if (typeof value === 'number') {
        return value;
    }
    if (typeof value !== 'string') {
        return defaultValue;
    }
    const result = parseInt(value, 10);
    if (isNaN(result)) {
        return defaultValue;
    }
    return result;
}
exports.str2num = str2num;
