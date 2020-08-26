import * as React from "react";

export interface FormFieldProps {
    compact?: boolean;
    description?: string | JSX.Element | null;
    descriptionIsHtml?: boolean;
    disabled?: boolean;
    errors?: string[];
    hint?: string | JSX.Element;
    label?: string;
    labelHint?: string;
    labelChildren?: JSX.Element;
    name: string;
    readonly?: boolean;
    required?: boolean;
    noFieldWrap?: boolean;
}

export class FormField extends React.Component<FormFieldProps, {}> {
    public render() {
        // create optional description field
        let descEl = null;
        if (typeof this.props.description === "string" && this.props.descriptionIsHtml)
            descEl = <div className="form-field-desc" dangerouslySetInnerHTML={{ __html: this.props.description }} />;
        else if (this.props.description)
            descEl = <div className="form-field-desc">{this.props.description}</div>;

        // create errors element if any errors provided
        let errorsEl = null;
        if (this.props.errors && this.props.errors.length) {
            errorsEl = this.props.errors.map((err: string, i) => <div className="error" key={i}>{err}</div>);
            errorsEl = <div className="field-errors">{errorsEl}</div>;
        }

        // create label element if label text provided
        let labelEl = null;
        if (this.props.label) {
            const reqEl = this.props.required !== undefined && this.props.required
                ? "<span class=\"req\">*</span>"
                : "";

            const labelProps: React.LabelHTMLAttributes<any> = {};
            if (this.props.name)
                labelProps.htmlFor = this.props.name;

            labelEl = <label { ...labelProps } dangerouslySetInnerHTML={{ __html: this.props.label + reqEl}} />;
        }

        // create optional label hint element
        let labelHintEl = null;
        if (this.props.labelHint)
            labelHintEl = <div className="field-help">{this.props.labelHint}</div>;

        // create optional hint element
        let hintEl = null;
        if (this.props.hint)
            hintEl = <div className="field-help">{this.props.hint}</div>;

        if (this.props.noFieldWrap) {
            return <div className={(this.props.errors && this.props.errors.length) ? "field-with-errors" : ""}>
                {descEl}
                {this.props.children}
                {hintEl}
                {errorsEl}
            </div>;
        }

        const classNames = ["form-row"];
        if (this.props.compact)
            classNames.push("compact");
        if (this.props.errors && this.props.errors.length)
            classNames.push("field-with-errors");

        return <div className={classNames.join(" ")}>
            <div className="form-label">
                {labelEl}
                {labelHintEl}
                {this.props.labelChildren}
            </div>
            <div className="form-field">
                {descEl}
                {this.props.children}
                {hintEl}
                {errorsEl}
            </div>
            <div className="clear"></div>
        </div>;
    }
}
