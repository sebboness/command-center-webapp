import { IComponentWithValidatedForm, ValidatedInputBase } from ".";
import * as _ from "lodash";
import * as expr from "property-expr";
import * as React from "react";
import * as ReactDOM from "react-dom";
import * as BS from "reactstrap";
import * as yup from "yup";
import { IFieldValidationError } from "../../models/validation";
import { ReactHelper, Utility } from "../../utils";
import * as YupHelper from "../../utils/YupHelper";
// @ts-ignore

/**
 * Converts yup.ValidationError object into array of InputValidationError
 * @param error yup.ValidationError object
 */
export const YupErrorsToValidationErrors = (schema: yup.Schema<any>, error: yup.ValidationError, forInputName?: string): IFieldValidationError[] => {
    let yupErrors = error.inner && error.inner.length
        ? error.inner
        : [error];

    if (yupErrors.length > 1)
        yupErrors = _.sortBy(yupErrors, [(err: yup.ValidationError) => err.path]);

    // A yup validation error may contain multiple errors for an input name.
    // There may be multiple yup validation errors for the same input name.

    const errors: IFieldValidationError[] = [];
    yupErrors.forEach((ye) => {
        if (ye.errors) {
            const name = ye.path || forInputName || "";
            const idx = errors.findIndex((e) => e.inputName === name);
            const yeErrors = ye.errors.map((e) => {
                // filter out ugly error "[label] must be a `[type]`, but the final value was..."
                // and replace with "nicer" error.
                const fv_idx = e.indexOf("type, but the final value");
                let err = fv_idx > 0 ? e.substr(0, fv_idx) : e;

                const dotIdx = name.lastIndexOf(".");

                // we need to try to substitute $parent with the field's parent field label
                if (err.indexOf("$parent") > -1 && dotIdx > -1) {
                    const parentInputName = name.substr(0, dotIdx);
                    try {
                        const parentLabel = YupHelper.getFieldLabel(schema, parentInputName);
                        err = err.replace(/\$parent/g, parentLabel);
                    }
                    catch {}
                }

                // substitute $label with the field's field label
                if (err.indexOf("$label") > -1) {
                    try {
                        const label = YupHelper.getFieldLabel(schema, name);
                        err = err.replace(/\$label/g, label);
                    }
                    catch {}
                }

                return err;
            });

            if (idx >= 0) {
                const inputErrors = errors[idx].errors.concat(yeErrors);
                errors[idx].errors = inputErrors;
            }
            else
                errors.push({
                    inputName: name,
                    errors: yeErrors,
                });
        }
    });

    return errors;
};

interface OwnProps<T> {
    formComponent: IComponentWithValidatedForm;
    model: T;
    onBeforeSubmit?: () => void;
    onCustomValidation?: () => IFieldValidationError[];
    onInputChange?: (inputName: string, value: any, checked: boolean) => void;
    onValidationErrors?: (errors: IFieldValidationError[], isOnBlur: boolean) => void;
    onValidSubmit?: (model: T) => void;
    schema: yup.Schema<T>;
    scrollToErrors?: boolean;
    showErrorsOnSubmit?: boolean;
    showErrorsOnBlur?: boolean;
}

interface OwnState {
}

export class ValidatedForm<T> extends React.Component<OwnProps<T>, OwnState> {

    private fields: string[];
    private changeTimer: NodeJS.Timer | undefined;

    public constructor(props: OwnProps<T>) {
        super(props);
        this.fields = [];

        this.onFormChange = this.onFormChange.bind(this);
    }

    public componentDidUpdate() {
    }

    public componentWillUpdate() {
        // reset fields
        this.fields = [];
    }

    /**
     * Returns the inputs value. Performs checks for input type such as checkbox booleans, etc.
     */
    public getInputValue = (input: HTMLSelectElement & HTMLInputElement & HTMLTextAreaElement): any => {
        let value: any = input.value;
        if (input.type === "checkbox" && input.value === "on")
            value = input.checked;
        return value;
    }

    public onInputBlur = (e: React.FormEvent<HTMLFormElement>) => {
        const input = e.target as HTMLSelectElement & HTMLInputElement & HTMLTextAreaElement;

        if (input === null || input === undefined)
            return;

        // show validation error list summary by default
        const showErrorsOnBlur = this.props.showErrorsOnBlur === undefined
        ? true
        : this.props.showErrorsOnBlur;

        if (!showErrorsOnBlur)
            return;

        if (!input.name)
            return;

        this.validateField(input.name);
    }

    public onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        this.validate();
    }

    public onFormChange(e: React.FormEvent<HTMLFormElement>) {
        if (typeof e.persist === "function")
            e.persist();

        const target = e.target as (HTMLInputElement & HTMLSelectElement & HTMLTextAreaElement);
        const value = this.getInputValue(target);
        const checked = target.checked || false;
        this.props.formComponent.setFieldValue(target.name, value, checked);

        if (this.changeTimer)
            clearTimeout(this.changeTimer);

        this.changeTimer = setTimeout(() => this.onInputBlur(e), 375);
    }

    public validate() {
        if (typeof this.props.onBeforeSubmit === "function")
            this.props.onBeforeSubmit();

        this.props.formComponent.toggleProcessing(true);
        this.props.formComponent.setFormErrors([]);

        let errors: IFieldValidationError[] = [];
        if (typeof this.props.onCustomValidation === "function")
            errors = this.props.onCustomValidation();

        this.props.schema.validate(this.props.model, { abortEarly: false })
        .then((model) => {
            if (errors.length) {
                this.handleSubmitValidationFailed(errors);
                return;
            }

            // call form built-in validation handler
            this.props.formComponent.handleValidationErrors([]);

            // to clear errors
            // call options props validation handler
            if (typeof this.props.onValidationErrors === "function")
                this.props.onValidationErrors([], false);

            // model is valid
            if (typeof this.props.onValidSubmit === "function") {
                this.props.onValidSubmit(model as T);
            }
        }, (err: yup.ValidationError) => {
            // console.warn("invalid form model", err);
            errors = errors.concat(YupErrorsToValidationErrors(this.props.schema, err));
            this.handleSubmitValidationFailed(errors);
        })
        .catch((err) => {
            console.warn("submit validation error caught", err);
        });

        return false;
    }

    public validateField(inputName: string) {
        if (!inputName)
            return;

        try {
            this.props.schema.validate(this.props.model, { abortEarly: false })
            .then((model) => {
                // clear errors for prop
                const errors = [{ inputName, errors: [] }];

                // call form built-in validation handler
                this.props.formComponent.clearValidationErrors(inputName);

                // call options props validation handler
                if (typeof this.props.onValidationErrors === "function")
                    this.props.onValidationErrors(errors, true);
            }, (err: yup.ValidationError) => {
                // get only those errors for the input field
                const errors = YupErrorsToValidationErrors(this.props.schema, err, inputName)
                    .filter((_err) => _err.inputName === inputName);

                // call form built-in validation handler
                this.props.formComponent.handleValidationErrors(errors, inputName);

                // call options props validation handler
                if (typeof this.props.onValidationErrors === "function")
                    this.props.onValidationErrors(errors, true);
            });
        }
        catch (err) {
            // input.name does not exist in schema
        }
    }

    public render() {
        // setup fields array
        ReactHelper.recursiveMap(this.props.children, (child: React.ReactNode) => {
            const comp = child as ValidatedInputBase<any, any>;
            if (comp.props.formComponent && comp.props.name)
                this.fields.push(comp.props.name);
        });

        // this.props.formComponent.registerFields(this.fields);

        // get server errors
        const errors = this.props.formComponent.getFormErrors();
        const errorsTitle = this.props.formComponent.getFormErrorsTitle();

        return <form
            onSubmit={this.onSubmit}
            onBlur={this.onInputBlur}
            onChange={this.onFormChange}
            noValidate method="post"
        >
            <BS.Alert color="warning" id="form-errors" style={{ display: errors && errors.length ? "block" : "none" }}>
                <h3>{errorsTitle}</h3>
                <ul>
                    {errors && errors.map((e, i) => (<li key={i}>{e.toString()}</li>))}
                </ul>
            </BS.Alert>

            {this.props.children}
        </form>;
    }

    /**
     * Returns the HTML string query selector of the top most positioned element
     * provided by the array of queries
     * @param queries HTML string query selectors
     */
    private getTopMostQuery(queries: string[]): string | undefined {
        if (!queries)
            return undefined;

        let topMostY = Utility.getScrollPosition().y;
        let topMostQuery = queries[0];
        const formEl = ReactDOM.findDOMNode(this);

        queries.map((query) => {
            if (formEl) {
                const matches = (formEl as Element).querySelectorAll(query);
                if (matches.length) {
                    const targetEl = matches[0].parentNode as Element;
                    const elPos = Utility.getElementPosition(targetEl);
                    if (elPos.top < topMostY) {
                        topMostY = elPos.top;
                        topMostQuery = query;
                    }
                }
            }
        });

        return topMostQuery;
    }

    private handleSubmitValidationFailed(errors: IFieldValidationError[]) {
        // console.warn("invalid form model", err);
        let allErrorsArray: string[] = [];
        errors.map((ve) => allErrorsArray = [...allErrorsArray, ...ve.errors]);

        // call form built-in validation handler
        this.props.formComponent.handleValidationErrors(errors);

        // call options props validation handler
        if (typeof this.props.onValidationErrors === "function")
            this.props.onValidationErrors(errors, false);

        this.props.formComponent.toggleProcessing(false);

        // show validation error list summary by default
        const showErrorsOnSubmit = this.props.showErrorsOnSubmit === undefined
            ? true
            : this.props.showErrorsOnSubmit;
        if (showErrorsOnSubmit)
            this.props.formComponent.setFormErrors(allErrorsArray);

        // jump to top most error
        if (errors.length) {
            const query = this.getTopMostQuery(errors.map((x) => (`[name="${x.inputName}"]`)));
            if (query) {
                this.scrollToElement(query);
            }
        }
    }

    private scrollToElement(query: string | Element) {
        if (typeof window === "undefined")
            return;

        const scrollToErrors = this.props.scrollToErrors === undefined
            ? true
            : this.props.scrollToErrors;

        if (!scrollToErrors)
            return;

        this.props.formComponent.scrollToElement(query);
    }
}
