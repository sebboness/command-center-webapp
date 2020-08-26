import * as React from "react";
import { ValidatedInputBase } from "./";
import { Utility } from "../../utils";

export interface ValidatedInputProps {
    checked?: boolean;
    css?: string;
    id?: string;
    label?: string;
    placeholder?: string;
    title?: string;
    type?: string;
}

export class ValidatedInput extends ValidatedInputBase<ValidatedInputProps, {}> {
    public render() {
        const isRadioOrCheck = ["checkbox", "radio"].indexOf(this.props.type || "") > -1;
        const value = this.getValue(true);

        return <input
                checked={this.props.checked}
                disabled={this.props.disabled}
                type={this.props.type || "text"}
                id={this.props.id || (isRadioOrCheck ? "" : Utility.toHtmlIdString(this.props.name))}
                name={this.props.name}
                className={this.props.css || (isRadioOrCheck ? "" : "txt-med")}
                placeholder={this.props.placeholder}
                readOnly={this.props.readonly}
                title={this.props.title}
                value={value}
                onChange={this.onChangeInput}
            />;
    }
}
