import * as React from "react";
import { ValidatedFormFieldBase } from "../validation";
import { TextFieldProps, TextField } from "./";

export class EmailField extends ValidatedFormFieldBase<TextFieldProps, {}> {
    public render() {
        return <TextField { ...this.props } placeholder={this.props.placeholder || "example@email.com"} type="email">
            {this.props.children}
        </TextField>;
    }
}
