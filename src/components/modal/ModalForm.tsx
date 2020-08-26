import * as React from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, ModalProps } from "reactstrap";
import { LoadingIcon } from "../generic";
import { IComponentWithValidatedForm } from "../validation";
import { Utility } from "../../utils";

interface OptionalProps {
    headerClassName?: string;
    id?: string;
    labelCancel?: JSX.Element | string;
    labelSave?: JSX.Element | string;
    onCancel?: () => void;
    onSave?: () => void;
    processingMessage?: JSX.Element | string;
    showProcessing?: boolean;
    size?: "lg" | "sm" | undefined;
    title?: JSX.Element | string;
}

type OwnProps = OptionalProps & {
    formComponent: IComponentWithValidatedForm;
    processing: boolean;
    open: boolean;
    toggle?: () => void;
};

interface OwnState {
}

export class ModalForm<P, S> extends React.Component<P & OwnProps, S & OwnState> {

    public static defaultProps: OptionalProps = {
        id: `modal-${Utility.guid()}`,
        processingMessage: <Button color="primary"><LoadingIcon /> Processing&hellip;</Button>,
        showProcessing: true,
    };

    public constructor(props: any) {
        super(props);
    }

    public onCancelClick() {
        if (this.props.onCancel)
            this.props.onCancel();
    }

    public onSaveClick() {
        if (this.props.onSave)
            this.props.onSave();
        else
            this.props.formComponent.triggerSubmit();
    }

    public render() {
        let footer = <ModalFooter>
            <Button color="link" onClick={() => this.onCancelClick()}>{this.props.labelCancel || "Cancel"}</Button>
            <Button color="primary" onClick={() => this.onSaveClick()}>{this.props.labelSave || "Save"}</Button>
        </ModalFooter>;

        if (this.props.processing && this.props.showProcessing)
            footer = <ModalFooter>{this.props.processingMessage}</ModalFooter>;

        const modalProps: ModalProps = {
            backdrop: "static",
            id: this.props.id,
            keyboard: true,
            onClosed: () => {},
            onOpened: () => this.focusOnInput(),
            isOpen: this.props.open,
            toggle: this.props.toggle,
        };

        if (this.props.size)
            modalProps.size = this.props.size;

        return <Modal { ...modalProps }>
                <ModalHeader className={"modal-header alert-" + (this.props.headerClassName || "info")} toggle={this.props.toggle}>
                    {this.props.title}
                </ModalHeader>

                <ModalBody>
                    {this.props.children}
                </ModalBody>

                {footer}
            </Modal>;
    }

    private focusOnInput() {
        const id = this.props.id || "";
        const modalEl = document.getElementById(id as string);
        if (modalEl) {
            // ,number,password,date
            const matches = modalEl.querySelectorAll(`input[type="text"], input[type="number"], input[type="password"], input[type="date"], textarea, select`);
            if (matches.length && typeof (matches[0] as any)["focus"] === "function") {
                (matches[0] as any)["focus"]();
            }
        }
    }
}
