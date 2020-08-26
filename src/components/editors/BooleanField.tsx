import * as React from "react";
import { FormField } from ".";
import { ValidatedFormFieldBase } from "../validation";

interface OwnProps {
    style?: "h" | "v";
    falseLabel: string;
    trueLabel: string;
}

export class BooleanField extends ValidatedFormFieldBase<OwnProps, {}> {
    public render() {
        const value = this.getValue(true) as boolean;
        const label = this.getLabel(this.props.label);

        return <FormField {...this.props} errors={this.getErrors()} label={label} name={this.props.name} required={false}>
            <ul className={"options-" + (this.props.style || "v")}>
                <li>
                    <label>
                        <input
                            checked={value === true}
                            type="radio"
                            name={this.props.name}
                            onChange={this.onChangeInput}
                            value="on"
                        /> {this.props.trueLabel}
                    </label>
                </li>
                <li>
                    <label>
                        <input
                            checked={value === false}
                            type="radio"
                            name={this.props.name}
                            onChange={this.onChangeInput}
                            value="off"
                        /> {this.props.falseLabel}
                    </label>
                </li>
            </ul>
            {this.props.children}
        </FormField>;
    }
}
