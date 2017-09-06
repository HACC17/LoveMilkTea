"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util = require("util");
const chalk = require("chalk");
const guards_1 = require("../../guards");
const format_1 = require("./format");
exports.LOGGER_STATUS_COLORS = new Map([
    ['debug', chalk.magenta.dim],
    ['info', chalk.gray],
    ['ok', chalk.green],
    ['warn', chalk.yellow],
    ['error', chalk.red],
]);
class Logger {
    constructor({ level = 'info', prefix = '', stream = process.stdout }) {
        this.level = level;
        this.prefix = prefix;
        this.stream = stream;
    }
    debug(msg) {
        this.log('debug', msg);
    }
    info(msg) {
        this.log('info', msg);
    }
    ok(msg) {
        this.log('ok', msg);
    }
    warn(msg) {
        this.log('warn', msg);
    }
    error(msg) {
        this.log('error', msg);
    }
    msg(msg) {
        if (typeof msg === 'function') {
            msg = msg();
        }
        this.stream.write(this.enforceLF(msg));
    }
    nl(num = 1) {
        this.stream.write(this.enforceLF('\n'.repeat(num)));
    }
    shouldLog(level) {
        return guards_1.LOG_LEVELS.indexOf(level) >= guards_1.LOG_LEVELS.indexOf(this.level);
    }
    enforceLF(str) {
        return str.match(/[\r\n]$/) ? str : str + '\n';
    }
    getStatusColor(level) {
        const color = exports.LOGGER_STATUS_COLORS.get(level);
        if (!color) {
            return chalk;
        }
        return color;
    }
    log(level, msg) {
        if (this.shouldLog(level)) {
            let prefix = this.prefix;
            if (typeof msg === 'function') {
                msg = msg();
            }
            if (prefix) {
                if (typeof prefix === 'function') {
                    prefix = prefix();
                }
                msg = util.format(prefix, msg);
            }
            msg = format_1.wordWrap(msg, { indentation: level.length + 3 }).split('\n').join('\n');
            msg = this.enforceLF(msg);
            const color = this.getStatusColor(level);
            const status = color.bold.bgBlack;
            const b = chalk.dim;
            this.stream.write(util.format.apply(util, [b('[') + status(level.toUpperCase()) + b(']'), msg]));
        }
    }
}
exports.Logger = Logger;
