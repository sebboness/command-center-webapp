import * as React from "react";
import { ValidatedInputBase } from "./";
import { SelectItem } from "../../models/editors";
import { Utility } from "../../utils";

export interface ValidatedSelectProps {
    css?: string;
    id?: string;
    items: SelectItem[];
    placeholder?: string;
    placeholderValue?: any;
    title?: string;
}

export class ValidatedSelect extends ValidatedInputBase<ValidatedSelectProps, {}> {
    public render() {
        const value = this.getValue(true);
        const options = this.props.items.map((item, i) => {
            return <option
                key={i + 1}
                value={item.id !== null && item.id !== undefined ? item.id : ""}
            >{item.render}</option>;
        });

        if (this.props.placeholder || this.props.placeholderValue !== undefined) {
            const placeholder = <option key={0} value={this.props.placeholderValue || ""}>{this.props.placeholder || "Select"}</option>;
            options.splice(0, 0, placeholder);
        }

        return <select
                id={this.props.id || Utility.toHtmlIdString(this.props.name)}
                name={this.props.name}
                className={this.props.css || "txt-med"}
                value={value}
                onChange={this.onChangeInput}
                title={this.props.title}
            >
                {options}
            </select>;
    }
}
