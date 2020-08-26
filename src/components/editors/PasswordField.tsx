import * as React from "react";
import { TextField, TextFieldProps } from "./";
import { ValidatedFormFieldBase } from "../validation";

export class PasswordField extends ValidatedFormFieldBase<TextFieldProps, {}> {
    public render() {
        return <TextField { ...this.props } type="password">
            {this.props.children}
        </TextField>;
    }
}
