import * as React from "react";
import * as BS from "reactstrap";
import { AlertTitle, AlertType } from "../../models/alert";
import { Icon } from "../generic";
import { ReactHelper } from "../../utils";

interface OwnProps {
    closeable?: boolean;
    icon?: string;
    id?: string;
    show?: boolean;
    title?: AlertTitle;
    type?: AlertType;
    onDismiss?: () => void;
    onHide?: () => void;
}

interface OwnState {
    show: boolean;
}

export class Alert extends React.Component<OwnProps, OwnState> {

    public constructor(props: OwnProps) {
        super(props);

        this.state = {
            show: true,
        };
    }

    public render() {
        if (this.props.show !== undefined && !this.props.show)
            return null;

        const iconEl = this.props.icon
            ? <Icon icon={this.props.icon} />
            : null;

        const titleEl = this.props.title
            ? (typeof this.props.title === "string"
                ? <strong>{iconEl}{(this.props.icon ? " " : "") + this.props.title}</strong>
                : this.props.title)
            : null;

        const closeBtn = this.props.closeable || typeof this.props.onDismiss === "function"
            ? <a href="#" className="close" aria-label="Close" title="Close" onClick={(e) => { ReactHelper.emptyClick(e); this.closeAlert(); }}>
                <Icon icon="times" />
            </a>
            : null;

        return <BS.Collapse isOpen={this.state.show} tag="div" timeout={125}>
                <BS.Alert
                    color={this.props.type || "info"}
                    id={this.props.id}
                >
                {closeBtn}
                {titleEl}
                {typeof this.props.children === "string"
                    ? <div dangerouslySetInnerHTML={{ __html: this.props.children }} />
                    : this.props.children}
                </BS.Alert>
            </BS.Collapse>;
    }

    private closeAlert() {
        this.setState({ ...this.state, show: false }, () => {
            setTimeout(() => {
                if (typeof this.props.onDismiss === "function")
                    this.props.onDismiss();
            }, 150);
        });
    }
}

interface ErrorAlertProps {
    dismissHandler?: () => void;
    errors?: string[];
    title?: string;
}

export const ErrorAlert: React.SFC<ErrorAlertProps> = (props) => {
    if (!props.errors || !props.errors.length)
        return null;

    return <Alert
        onDismiss={props.dismissHandler}
        show={props.errors !== undefined && props.errors.length > 0}
        title={props.title || "An error occurred"}
        type="danger"
    >
        <ul>
            {(props.errors || []).map((e, i) => <li key={i}>{e}</li>)}
        </ul>
    </Alert>;
};
