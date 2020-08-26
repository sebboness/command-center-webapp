import React from "react";
import * as RS from "react-select";
import { FormField } from "./";
import { ValidatedFormFieldBase } from "../validation";
import { CreatableProps } from "react-select/lib/Creatable";
import { Props as SelectProps } from "react-select/lib/Select";
import { AsyncProps } from "react-select/lib/Async";

interface OwnProps {
    css?: string;
    id?: string;
    isAsync?: boolean;
    isCreatable?: boolean;
    label?: string;
    options: SelectProps | CreatableProps<any> | AsyncProps<any>;
}

export class SelectField extends ValidatedFormFieldBase<OwnProps, {}> {

    public handleChange = (value: any) => {
        this.props.formComponent.setFieldValue(this.props.name, value);

        if (this.props.onInputChange)
            this.props.onInputChange(this.props.name, value);
    }

    public render() {
        const value = this.getValue(true);
        const label = this.getLabel(this.props.label);

        const selectProps: any = {
            // filterOptions: (options, filter, currentValues) => { // by default no filtering of options. override in custom implementation.
            //     return options;
            // },
            ...this.props.options,
            name: this.props.name,
            value,
            onBlur: () => this.props.formComponent.triggerBlur(this.props.name),
            onChange: (selectedValue: any) => this.handleChange(selectedValue),
        };

        let selectEl: JSX.Element | null = null;
        if (this.props.isCreatable && this.props.isAsync)
            selectEl = <RS.AsyncCreatable { ...selectProps } />
        else if (this.props.isCreatable)
            selectEl = <RS.Creatable { ...selectProps } />;
        else if (this.props.isAsync)
            selectEl = <RS.Async { ...selectProps } />
        else
            selectEl = <RS.default { ...selectProps } />;

        // let selectEl = <Select {...selectProps} />;
        // if (this.props.isAsync) {
        //     if (this.props.isCreatable)
        //         selectEl = <SelectAsyncCreatable {...selectProps as any} />;
        //     else
        //         selectEl = <SelectAsync {...selectProps as any} />;
        // }
        // else if (this.props.isCreatable)
        //     selectEl = <SelectCreatable {...selectProps as any} />;

        return <FormField {...this.props} errors={this.getErrors()} label={label} name={this.props.name} required={this.isRequired(this.props.required)}>
            {selectEl}
            {this.props.children}
        </FormField>;
    }
}
