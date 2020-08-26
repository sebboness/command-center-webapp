import React from "react";
import { IComponentWithValidatedForm } from "./";

interface OwnProps {
    disabled?: boolean;
    formComponent: IComponentWithValidatedForm;
    name: string;
    onInputChange?: (fieldName: string, value: string) => void;
    readonly?: boolean;
    value?: any;
}

export class ValidatedInputBase<TProps, TState> extends React.Component<OwnProps & TProps, TState> {
    /**
     * If a value is provided, returns the value, otherwise retrieves the value from the provided formComponent
     */
    public getValue = (returnNullAsEmpty: boolean = false): any => {
        if (this.props.value !== undefined && this.props.value !== null)
            return this.props.value;
        else
            return this.props.formComponent.getFieldValue(this.props.name, returnNullAsEmpty);
    }

    /**
     * handler for input change event
     */
    public onChangeInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        if (this.props.onInputChange)
            this.props.onInputChange(e.target.name, e.target.value);
    }
}
