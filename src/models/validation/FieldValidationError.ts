export interface IFieldValidationError {
    inputName: string;
    errors: string[];
}

export class FieldValidationError implements IFieldValidationError {
    public inputName: string;
    public errors: string[];
    constructor(inputName: string, errors: string | string[]) {
        this.inputName = inputName;
        this.errors = Array.isArray(errors) ? errors : [errors];
    }
}
