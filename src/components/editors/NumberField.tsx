import React from "react";
import { TextField, TextFieldProps } from "./";
import { ValidatedFormFieldBase } from "../validation";

export type NumberFieldProps = TextFieldProps & {
    max?: number;
    min?: number;
    step?: number;
};

export class NumberField extends ValidatedFormFieldBase<NumberFieldProps, {}> {
    public render() {
        return <TextField
            { ...this.props }
            css={this.props.css || "txt-num"}
            type="number"
        >
            {this.props.children}
        </TextField>;
    }
}
