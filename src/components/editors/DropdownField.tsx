import React from "react";
import { FormField } from "./";
import { SelectItem } from "../../models/editors";
import { ValidatedFormFieldBase } from "../validation";

interface OwnProps {
    items: SelectItem[];
    css?: string;
    onInputChange?: (fieldName: string, value: string) => void;
    placeholder?: string;
    placeholderValue?: any;
}

export class DropdownField extends ValidatedFormFieldBase<OwnProps, {}> {
    public render() {
        const value = this.getValue(true);

        const items = this.props.items.map((item, i) => {
            return <option
                    key={i + 1}
                    value={item.id !== null && item.id !== undefined ? item.id : ""}
                >
                    {item.render}
                </option>;
        });

        if (this.props.placeholder !== undefined) {
            const phVal = this.props.placeholderValue === undefined ? "" : this.props.placeholderValue;
            items.splice(0, 0, <option key={0} value={phVal}>{this.props.placeholder}</option>);
        }

        return <FormField {...this.props} errors={this.getErrors()} label={this.getLabel(this.props.label)} name={this.props.name} required={this.isRequired(this.props.required)}>
            <select
                className={this.props.css || "txt-med"}
                name={this.props.name}
                onChange={this.onChangeInput}
                value={value}
            >
                {items}
            </select>
            {this.props.children}
        </FormField>;
    }
}
