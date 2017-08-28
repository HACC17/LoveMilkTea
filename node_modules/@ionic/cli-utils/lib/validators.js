"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk = require("chalk");
const string_1 = require("./utils/string");
function validate(input, key, validators, errors) {
    const throwErrors = typeof errors === 'undefined';
    if (!errors) {
        errors = [];
    }
    for (let validator of validators) {
        const r = validator(input, key);
        if (r !== true) {
            errors.push({ message: r, inputName: key });
        }
    }
    if (throwErrors && errors.length > 0) {
        throw errors;
    }
}
exports.validate = validate;
exports.validators = {
    required(input, key) {
        if (!input) {
            if (key) {
                return `${chalk.green(key)} must not be empty.`;
            }
            else {
                return 'Must not be empty.';
            }
        }
        return true;
    },
    email(input, key) {
        if (!string_1.isValidEmail(input)) {
            if (key) {
                return `${chalk.green(key)} is an invalid email address.`;
            }
            else {
                return 'Invalid email address.';
            }
        }
        return true;
    },
    numeric(input, key) {
        if (isNaN(Number(input))) {
            if (key) {
                return `${chalk.green(key)} must be numeric.`;
            }
            else {
                return 'Must be numeric.';
            }
        }
        return true;
    },
};
function contains(values, { caseSensitive = true }) {
    if (!caseSensitive) {
        values = values.map(v => typeof v === 'string' ? v.toLowerCase() : v);
    }
    return function (input, key) {
        if (!caseSensitive && typeof input === 'string') {
            input = input.toLowerCase();
        }
        if (values.indexOf(input) === -1) {
            const strValues = values.filter(v => typeof v === 'string'); // TODO: typescript bug?
            const mustBe = (strValues.length !== values.length ? 'unset or one of' : 'one of') + ': ' + strValues.map(v => chalk.green(v)).join(', ');
            if (key) {
                return `${chalk.green(key)} must be ${mustBe} (not ${typeof input === 'undefined' ? 'unset' : chalk.green(input)})`;
            }
            else {
                return `Must be ${mustBe} (not ${typeof input === 'undefined' ? 'unset' : chalk.green(input)})`;
            }
        }
        return true;
    };
}
exports.contains = contains;
