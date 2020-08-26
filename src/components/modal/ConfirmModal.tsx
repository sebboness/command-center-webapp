import * as React from "react";
import * as BS from "reactstrap";
import { LoadingIcon } from "../generic";

interface OptionalProps {
    headerClassName?: string;
    labelCancel?: JSX.Element | string;
    labelProceed?: JSX.Element | string;
    onCancel?: () => void;
    onProceed?: () => void;
    renderBody?: (data: any) => JSX.Element | null;
    processingMessage?: JSX.Element | string;
    showProcessing?: boolean;
}

type OwnProps = OptionalProps & {
    title: JSX.Element | string;
    toggle?: () => void;
};

interface OwnState {
    processing: boolean;
    isOpen: boolean;
    data?: any;
}

export class ConfirmModal extends React.Component<OwnProps, OwnState> {

    public static defaultProps: OptionalProps = {
        headerClassName: "info",
        labelCancel: "Cancel",
        labelProceed: "Proceed",
        processingMessage: <BS.Button color="primary"><LoadingIcon /> Processing&hellip;</BS.Button>,
        showProcessing: true,
    };

    public constructor(props: any) {
        super(props);
        this.state = {
            processing: false,
            isOpen: false,
        };
    }

    /**
     * Closes the confirmation dialog and resets its state
     */
    public close() {
        this.setState({ ...this.state, data: undefined, isOpen: false }, () => {
            setTimeout(() => {
                this.setState({ ...this.state, processing: false });
            }, 200);
        });
    }

    /**
     * Opens the confirmation dialog and optionally sets a reference object
     * (handy when needing to manipulate object upon proceed click)
     * @param data optional reference object
     */
    public show(data?: any) {
        this.setState({ ...this.state, processing: false, data, isOpen: true });
    }

    /**
     * Returns the reference object
     */
    public getRef() {
        return this.state.data;
    }

    public render() {
        const modalProps: BS.ModalProps = {
            backdrop: "static",
            keyboard: true,
            onClosed: () => {},
            isOpen: this.state.isOpen,
            toggle: this.props.toggle,
        };

        let footer = <BS.ModalFooter>
                <BS.Button color="link" onClick={() => this.onCancelClick()}>{this.props.labelCancel}</BS.Button>
                <BS.Button color="primary" onClick={() => this.onProceedClick()}>{this.props.labelProceed}</BS.Button>
            </BS.ModalFooter>;

        if (this.state.processing && this.props.showProcessing)
            footer = <BS.ModalFooter>{this.props.processingMessage}</BS.ModalFooter>;

        const body = typeof this.props.renderBody === "function"
            ? this.props.renderBody(this.state.data)
            : null;

        return <BS.Modal { ...modalProps }>
            <BS.ModalHeader className={"modal-header alert-" + (this.props.headerClassName)}>
                {this.props.title}
            </BS.ModalHeader>

            <BS.ModalBody>
                {this.props.children}
                {body}
            </BS.ModalBody>

            {footer}
        </BS.Modal>;
    }

    /**
     * Internal handling of cancel click
     */
    private onCancelClick() {
        if (this.props.onCancel)
            this.props.onCancel();

        this.close();
    }

    /**
     * Internal handling of proceed click
     */
    private onProceedClick() {
        if (this.props.onProceed)
            this.props.onProceed();

        this.setState({ ...this.state, processing: true });
    }
}
