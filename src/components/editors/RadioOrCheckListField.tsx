import React from "react";
import { FormField } from "./";
import { SelectItem } from "../../models/editors";
import { ValidatedFormFieldBase } from "../validation";

interface OwnProps {
    inputCss?: string;
    items: SelectItem[];
    listCss?: string;
    onInputChange?: (fieldName: string, value: string) => void;
    type: "radio" | "checkbox";
}

export class RadioOrCheckListField extends ValidatedFormFieldBase<OwnProps, {}> {
    public render() {
        const val = this.getValue(true);
        const values = Array.isArray(val) ? val : [val];

        const items = this.props.items.map((item, i) => {
            const checked = values.indexOf(item.id) > -1;
            return <li key={i}>
                <label className={item.disabled ? "text-muted" : ""}>
                    <input
                        type={this.props.type}
                        name={this.props.name}
                        checked={checked}
                        className={this.props.inputCss}
                        disabled={item.disabled}
                        value={item.id !== null && item.id !== undefined ? item.id : ""}
                        onChange={this.onChangeInput}
                    /> {item.render}
                </label>
            </li>;
        });

        return <FormField {...this.props} errors={this.getErrors()} label={this.getLabel(this.props.label)} name={this.props.name} required={this.isRequired(this.props.required)}>
            <ul className={this.props.listCss || "options-v"}>{items}</ul>
            {this.props.children}
        </FormField>;
    }
}
