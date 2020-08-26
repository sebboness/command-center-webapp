import * as React from "react";
import { ValidatedFormFieldBase, ValidatedTextArea } from "../validation";
import { FormField } from ".";

export interface TextAreaFieldProps {
    noAutosize?: boolean;
    css?: string;
    id?: string;
    placeholder?: string;
    onInputChange?: (fieldName: string, value: string) => void;
    size?: "xxs" | "xs" | "sm" | "md" | "lg";
    style?: React.CSSProperties;
}

export class TextAreaField extends ValidatedFormFieldBase<TextAreaFieldProps, {}> {

    public render() {
        const size = this.props.size || "lg";
        let col = 12;
        switch (size) {
            case "xxs":
                col = 1; break;
            case "xs":
                col = 2; break;
            case "sm":
                col = 4; break;
            case "md":
                col = 8; break;
        }

        const errors = (this.props.errors || []).concat(this.getErrors());

        return <FormField {...this.props} errors={errors} label={this.getLabel(this.props.label)} name={this.props.name} required={this.isRequired(this.props.required)}>
            <ValidatedTextArea
                disabled={this.props.disabled}
                noAutosize={this.props.noAutosize}
                formComponent={this.props.formComponent}
                id={this.props.id || this.props.name}
                name={this.props.name}
                css={(this.props.css || "form-control") + " col-sm-" + col}
                placeholder={this.props.placeholder}
                readonly={this.props.readonly}
                value={this.props.value}
                onInputChange={this.props.onInputChange}
                style={this.props.style}
            />
            {this.props.children}
        </FormField>;
    }
}
