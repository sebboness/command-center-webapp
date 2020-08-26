import * as React from "react";
import { ValidatedFormFieldBase, ValidatedInput } from "../validation";
import { FormField } from "./";

export interface TextFieldProps {
    css?: string;
    id?: string;
    placeholder?: string;
    onInputChange?: (fieldName: string, value: string) => void;
    type?: string;
}

export class TextField extends ValidatedFormFieldBase<TextFieldProps, {}> {
    public render() {
        return <FormField {...this.props} errors={this.getErrors()} label={this.getLabel(this.props.label)} name={this.props.name} required={this.isRequired(this.props.required)}>
            <ValidatedInput
                disabled={this.props.disabled}
                formComponent={this.props.formComponent}
                type={this.props.type || "text"}
                id={this.props.id || this.props.name}
                name={this.props.name}
                css={this.props.css || "txt-med"}
                placeholder={this.props.placeholder}
                readonly={this.props.readonly}
                value={this.props.value}
                onInputChange={this.props.onInputChange}
            />
            {this.props.children}
        </FormField>;
    }
}
