"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Exception extends Error {
    constructor(message) {
        super(message);
        this.name = 'Exception';
        this.message = message;
        this.stack = (new Error()).stack || '';
    }
    toString() {
        return `${this.name}: ${this.message}`;
    }
}
exports.Exception = Exception;
class FatalException extends Exception {
    constructor(message, exitCode = 1) {
        super(message);
        this.message = message;
        this.exitCode = exitCode;
        this.fatal = true;
    }
}
exports.FatalException = FatalException;
class ShellException extends Exception {
    constructor(message, exitCode = 0) {
        super(message);
        this.message = message;
        this.exitCode = exitCode;
    }
}
exports.ShellException = ShellException;
