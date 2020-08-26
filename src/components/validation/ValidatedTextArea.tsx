import * as autosize from "autosize";
import React from "react";
import { ValidatedInputBase } from "./";
import { Utility } from "../../utils";

export interface ValidatedTextAreaProps {
    noAutosize?: boolean;
    css?: string;
    id?: string;
    label?: string;
    placeholder?: string;
    style?: React.CSSProperties;
}

export class ValidatedTextArea extends ValidatedInputBase<ValidatedTextAreaProps, {}> {

    private _textarea: HTMLTextAreaElement | null = null;

    public componentDidMount() {
        if (this._textarea && !this.props.noAutosize) {
            autosize(this._textarea);
            setTimeout(() => {
                if (this._textarea) autosize.update(this._textarea);
            }, 25);
        }
    }

    public componentWillUnmount() {
        if (this._textarea && !this.props.noAutosize) {
            autosize.destroy(this._textarea);
        }
    }

    public render() {
        const value = this.getValue(true);

        return <textarea
            disabled={this.props.disabled}
            id={this.props.id || Utility.toHtmlIdString(this.props.name)}
            name={this.props.name}
            className={this.props.css || "txt"}
            placeholder={this.props.placeholder}
            value={value}
            onChange={this.onChangeInput}
            readOnly={this.props.readonly}
            ref={(ref) => this._textarea = ref}
            style={this.props.style}
        />;
    }
}
