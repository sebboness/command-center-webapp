import * as React from "react";

interface OwnProps {
    errors: string[];
}

export class FormFieldErrors extends React.Component<OwnProps, {}> {
    public render() {
        if (!this.props.errors || !this.props.errors.length)
            return null;

        let errorsEl = null;
        if (this.props.errors && this.props.errors.length) {
            errorsEl = this.props.errors.map((err: string, i) => <div className="error" key={i}>{err}</div>);
            errorsEl = <div className="field-errors">{errorsEl}</div>;
        }

        return <div className={"field-with-errors"}>{errorsEl}</div>;
    }
}
