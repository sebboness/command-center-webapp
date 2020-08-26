import React from "react";
import { FormField } from "./";
import Link from "next/link";

interface OwnProps {
    cancelLabel?: string;
    cancelLink?: string | JSX.Element;
    compact?: boolean;
    css?: string;
    id?: string;
    label?: string;
    noFieldWrap?: boolean;
    showProcessing?: boolean;
    placeChildrenBefore?: boolean;
    processingMessage?: JSX.Element | string;
}

export class SubmitField extends React.Component<OwnProps, {}> {
    public static defaultProps: OwnProps = {
        cancelLabel: "Cancel",
        css: "btn btn-primary",
        label: "Submit",
        processingMessage: <p><i className="fa fa-spinner fa-spin"></i> Processing&hellip;<span className="mute"><br />Do not refresh this page</span></p>,
    };

    public render() {
        const inputEl = <input
            className={this.props.css}
            type="submit"
            value={this.props.label}
        />;

        if (this.props.showProcessing as boolean) {
            return <FormField name="" noFieldWrap={this.props.noFieldWrap} compact={this.props.compact}>{this.props.processingMessage}</FormField>;
        }

        const cancel = this.props.cancelLink
            ? (typeof this.props.cancelLink === "string"
                ? <Link href={this.props.cancelLink}><a className="btn btn-link">{this.props.cancelLabel}</a></Link>
                : this.props.cancelLink
            )
            : null;

        let cancelBefore = null;
        let childrenBefore = null;
        let cancelAfter = null;
        let childrenAfter = null;
        if (!this.props.placeChildrenBefore) {
            cancelAfter = cancel;
            cancelBefore = null;
            childrenAfter = this.props.children;
            childrenBefore = null;
        }
        else {
            cancelAfter = null;
            cancelBefore = cancel;
            childrenAfter = null;
            childrenBefore = this.props.children;
        }

        return <FormField name="" noFieldWrap={this.props.noFieldWrap} compact={this.props.compact}>
            {cancelBefore}{" "}
            {childrenBefore}{" "}
            {inputEl}{" "}
            {cancelAfter}{" "}
            {childrenAfter}
        </FormField>;
    }
}
