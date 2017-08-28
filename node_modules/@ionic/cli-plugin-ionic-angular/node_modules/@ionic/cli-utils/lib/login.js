"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk = require("chalk");
const validators_1 = require("./validators");
function promptToLogin(env) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        env.log.msg(`Log into your Ionic account\nIf you don't have one yet, create yours by running: ${chalk.green(`ionic signup`)}\n`);
        const email = yield env.prompt({
            type: 'input',
            name: 'email',
            message: 'Email:',
            validate: v => validators_1.validators.email(v),
        });
        const password = yield env.prompt({
            type: 'password',
            name: 'password',
            message: 'Password:'
        });
        yield env.session.login(email, password);
    });
}
exports.promptToLogin = promptToLogin;
