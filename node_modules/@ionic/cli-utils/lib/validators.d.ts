import { ValidationError, Validator, Validators } from '../definitions';
export declare function validate(input: string, key: string, validators: Validator[], errors?: ValidationError[]): void;
export declare const validators: Validators;
export declare function contains(values: (string | undefined)[], {caseSensitive}: {
    caseSensitive?: boolean;
}): Validator;
