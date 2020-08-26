import * as React from "react";
import { ValidatedFormFieldBase } from "../validation";

interface OwnProps {
    css?: string;
    id?: string;
}

export class Hidden extends ValidatedFormFieldBase<OwnProps, {}> {
    public render() {
        return <input
                    type="hidden"
                    id={this.props.id || this.props.name}
                    name={this.props.name}
                    className={this.props.css}
                    onChange={this.onChangeInput}
                    value={this.getValue(true)}
                />;
    }
}
