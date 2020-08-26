import * as React from "react";
import { FormField } from ".";
import { ValidatedFormFieldBase } from "../validation";

interface OwnProps {
    css?: string;
    id?: string;
    label?: string;
    fieldLabel?: string;
}

export class CheckboxField extends ValidatedFormFieldBase<OwnProps, {}> {
    public render() {
        const value = this.getValue(true) as boolean;
        const label = this.getLabel(this.props.label);
        const fieldLabel = this.props.fieldLabel || "";

        return <FormField {...this.props} errors={this.getErrors()} label={this.getLabel(fieldLabel)} name={this.props.name} required={false}>
            <label>
                <input
                    checked={value}
                    type="checkbox"
                    id={this.props.id || this.props.name}
                    name={this.props.name}
                    className={this.props.css}
                    onChange={this.onChangeInput}
                /> {label}
            </label>
            {this.props.children}
        </FormField>;
    }
}
