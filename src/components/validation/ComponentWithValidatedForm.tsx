import * as deepExtend from "deep-extend";
import { ValidatedForm } from ".";
import { List } from "immutable";
// @ts-ignore
import * as expr from "property-expr";
import * as ReactDOM from "react-dom";
import * as yup from "yup";
import { BaseComponent } from "../base";
import { IFieldValidationError, FormValidationModel } from "../../models/validation";
import * as YupHelper from "../../utils/YupHelper";

export interface OwnProps {
    onFormChange?: (model: any, inputName: string) => void;
}

export interface OwnState {
    fieldErrors: IFieldValidationError[];
    formModel: FormValidationModel<any>;
    formProcessing: boolean;
    modelChanged: boolean;
    serverErrors: string[];
    serverErrorsTitle: string;
}

export interface IComponentWithValidatedForm {

    form: ValidatedForm<any> | null;

    /**
     * Clears all validation errors. If inputname provided, clears errors for input only
     * @param {string} [inputName] The name of the field
     */
    clearValidationErrors: (inputName?: string) => void;

    /**
     * Returns the field validation errors
     */
    getAllFieldErrors: () => IFieldValidationError[];

    /**
     * Returns the validation errors for a field
     * @param {string} inputName The name of the field
     * @param {boolean} [excludeDeepFields] Whether or not to include child field errors. Defaults to true.
     * @returns {string[]}
     */
    getFieldErrors: (inputName: string, excludeDeepFields?: boolean) => string[];

    /**
     * Returns the label of the field by name as registered in the validation schema
     * @param {string} inputName The name of the field
     * @returns {string}
     */
    getFieldLabel: (inputName: string) => string;

    /**
     * Returns the value of the field by name using module property-expr
     * @param {string} inputName The name of the field
     * @param {boolean} [returnNullAsEmpty] Whether or not to return undefined/null values as empty strings. Defaults to false.
     * @returns {string}
     */
    getFieldValue: (inputName: string, returnNullAsEmpty?: boolean) => any;

    /**
     * Sets the form model of this component to the state and returns an object of the initial state of this component
     * @param {FormValidationModel<any>} formModel
     * @returns {OwnState}
     */
    getInitialState: (formModel: FormValidationModel<any>) => OwnState;

    /**
     * Returns a string array of server errors
     * @returns {string[]}
     */
    getFormErrors: () => string[];

    /**
     * Returns the title of the server errors
     * @returns {string}
     */
    getFormErrorsTitle: () => string;

    /**
     * Returns the form model
     */
    getFormModel: <T>() => FormValidationModel<T>;

    /**
     * Returns the form model
     */
    getFormModelData: <T>() => T;

    /**
     * Handler for field validation errors event
     * @param {IFieldValidationError[]} errors An array of provided field validation errors
     * @param {boolean} isOnBlur Whether the validation error occurred on field blur event
     */
    handleValidationErrors: (errors: IFieldValidationError[], inputName?: string) => void;

    /**
     * Returns the required flag as registered in the validation schema
     * @param {string} inputName The name of the field
     * @returns {boolean}
     */
    isFieldRequired: (inputName: string) => boolean;

    /**
     * Tries to parse the input's value to the correct type based on the validation schema
     * @param {HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement} input The input field
     */
    parseInputValueToCorrectType: (schema: yup.Schema<any>, value: any) => any;

    /**
     * Registers the validated fields of the form
     * @param {string[]} fields An array of the field names
     */
    registerFields: (fields: string[]) => void;

    /**
     * Scrolls to specified element within this form
     */
    scrollToElement: (query: string | Element) => void;

    /**
     * Sets the value of a field
     * @param {string} inputName The name of the field
     * @param {any} value The value of the field
     * @param {boolean} [checked] Whether the input field is checked or not (for checkboxes)
     * @param {function} [callback] Callback function after field is set
     */
    setFieldValue: (inputName: string, value: any, checked?: boolean, callback?: () => void) => void;

    /**
     * Sets the server returned submit errors
     * @param {string[]} serverErrors The returned server errors
     * @param {string} [errorTitle] The title for the server errors
     */
    setFormErrors: (serverErrors: string[], errorTitle?: string) => void;

    /**
     * Toggles the formProcessing state field
     * @param {boolean} formProcessing Whether or not the form is processing
     */
    toggleProcessing: (formProcessing: boolean) => void;

    /**
     * Triggers the blur event on an input of name
     */
    triggerBlur: (inputName: string) => void;

    /**
     * Triggers the submit event of the form
     */
    triggerSubmit: () => void;

    /**
     * Updates the form model state
     * @param {FormValidationModel<any>} formModel The model to update
     */
    updateFormModel: (formModel: FormValidationModel<any>, callback?: () => void) => void;

    /**
     * Updates the form model data state
     * @param {any} formModel The model data to update
     */
    updateFormModelData: (formModel: any, callback?: () => void) => void;
}

export abstract class ComponentWithValidatedForm<P, S>
    extends BaseComponent<P & OwnProps, S & OwnState>
    implements IComponentWithValidatedForm {

    public fields: string[] = [];
    public form: ValidatedForm<any> | null = null;

    private defaultServerErrorsTitle = "Some of the information you provided is incomplete or invalid. Please correct and submit again.";

    public constructor(props: any) {
        super(props);
    }

    public clearValidationErrors(inputName?: string) {
        if (inputName) {
            const errors = [{ inputName, errors: [] }];
            this.handleValidationErrors(errors, inputName);
        }
        else {
            this.handleValidationErrors([]);
        }
    }

    public getInitialState = (formModel: FormValidationModel<any>): OwnState => {
        return {
            fieldErrors: [],
            formModel,
            formProcessing: false,
            modelChanged: false,
            serverErrors: [],
            serverErrorsTitle: this.defaultServerErrorsTitle,
        };
    }

    public handleValidationErrors = (errors: IFieldValidationError[], inputName?: string, scrollToErrors?: boolean) => {
        if (!inputName) {
            // update entire errors array
            this.setState({ ...(this.state as any), fieldErrors: errors });
        }
        else {
            if (!errors.length) {
                const fieldErrors = [...this.state.fieldErrors].filter((e) => e.inputName !== inputName);
                this.setState({ ...(this.state as any), fieldErrors });
            }
            else {
                const oldErrors = [...this.state.fieldErrors];
                errors.forEach((err) => {
                    const oldErr = oldErrors.find((ne) => ne.inputName === inputName);
                    if (oldErr)
                        oldErr.errors = err.errors; // overwrite existing input errors
                    else
                        oldErrors.push(err); // app input errors
                });

                this.setState({ ...(this.state as any), fieldErrors: oldErrors });
            }

            if (scrollToErrors)
                this.scrollToElement(`[name="${inputName}"]`);
        }
    }

    public getAllFieldErrors = (): IFieldValidationError[] => {
        return [...this.state.fieldErrors];
    }

    public getFieldErrors = (inputName: string, excludeDeepFields: boolean = false): string[] => {
        let errors: string[] = [];
        const error = this.state.fieldErrors.find((err) => err.inputName === inputName);

        if (error)
            errors = errors.concat(error.errors);

        // include errors of child fields (separated by "." char, i.e. "address.city")
        if (!excludeDeepFields) {
            this.state.fieldErrors.filter((err) => (err.inputName).indexOf(inputName + ".") === 0).map((e) => {
                errors = errors.concat(e.errors);
            });
        }

        return errors;
    }

    public getFieldLabel = (inputName: string): string => {
        return YupHelper.getFieldLabel(this.state.formModel.rules, inputName);
    }

    public getFieldValue = (inputName: string, returnNullAsEmpty?: boolean): any => {
        try {
            const getter = expr.getter(inputName, this.state.formModel.data);
            const value = getter(this.state.formModel.data);

            return ((value === undefined || value === null) && returnNullAsEmpty)
                ? ""
                : value;
        }
        catch (err) {
            return "";
        }
    }

    public getFormErrors = (): string[] => {
        return this.state.serverErrors;
    }

    public getFormErrorsTitle = (): string => {
        return this.state.serverErrorsTitle;
    }

    public getFormModel = (): FormValidationModel<any> => {
        return { ...(this.state as any).formModel };
    }

    public getFormModelData<T>() {
        return deepExtend({}, this.state.formModel.data) as T;
    }

    public isFieldRequired = (inputName: string): boolean => {
        try {
            const fieldSchema = yup.reach(this.state.formModel.rules, inputName);
            return (fieldSchema as any)["_exclusive"]["required"] !== undefined;
        }
        catch (err) {
            return false;
        }
    }

    public parseInputValueToCorrectType = (schema: yup.Schema<any>, value: any) => {
        try {
            let type = (schema as any)["_type"] as string || "string";
            if (type === "array") {
                type = (schema as any)["_subType"]["_type"] as string || "string";
            }

            switch (type) {
                case "bool":
                case "boolean":
                    if (typeof value === "boolean")
                        return value;
                    const boolean = value === "" ? null : (value === "true" || value === "on" || false);
                    return boolean;
                case "number":
                    const number = value === "" ? null : parseFloat(value);
                    return number;
                case "string":
                default:
                    return value;
                // TODO: Add more later
            }
        }
        catch (err) {
            return value;
        }
    }

    public registerFields = (fields: string[]) => {
        this.fields = fields;
    }

    public scrollToElement(query: string | Element) {
        if (typeof window === "undefined")
            return;

        let targetEl: Element | undefined;
        if (typeof query === "string") {
            const formEl = ReactDOM.findDOMNode(this);
            if (formEl) {
                const matches = (formEl as Element).querySelectorAll(query);
                if (matches.length) {
                    targetEl = matches[0].parentNode as Element;
                }
            }
        }
        else
            targetEl = query;

        if (targetEl && typeof targetEl.scrollIntoView === "function") {
            targetEl.scrollIntoView({ block: "nearest" });
        }
    }

    public setFieldValue = (inputName: string, value: any, checked?: boolean, callback?: () => void) => {
        if (!inputName)
            return;

        try {
            const fieldSchema = yup.reach(this.state.formModel.rules, inputName);
            const isArray = (fieldSchema as any)["_type"] === "array";
            const model = Object.assign({}, this.state.formModel.data); // Object.assign({}, this.state.formModel.data);
            const setter = expr.setter(inputName, model);

            // parse value to correct type
            value = this.parseInputValueToCorrectType(fieldSchema, value);

            // special case for arrays (checkboxes)
            if (isArray && !Array.isArray(value)) {
                const getter = expr.getter(inputName, model);
                let arr = getter(model);
                if (Array.isArray(arr)) {
                    let list = List(arr);
                    const idx = list.indexOf(value);
                    if (!!checked) {
                        if (idx === -1)
                            list = list.push(value);
                    }
                    else {
                        arr = arr.filter((x, i) => i !== idx);
                    }
                    value = arr;
                }
            }

            // update model
            setter(model, value);

            this.setState({
                ...(this.state as any),
                modelChanged: true,
                formModel: {
                    ...(this.state as OwnState).formModel,
                    data: model,
                },
            }, () => {
                if (typeof callback === "function")
                    callback();

                if (typeof this.props.onFormChange === "function")
                    this.props.onFormChange(model, inputName);

                if (this.form !== null && typeof this.form.props.onInputChange === "function")
                    this.form.props.onInputChange(inputName, value, !!checked);
            });
        }
        catch (err) {
            console.warn("unable to set value for", inputName, "(" + value + ")");
            console.warn(err);
        }
    }

    public setFormErrors = (serverErrors: string[], errorTitle?: string, scrollToErrors?: boolean) => {
        this.setState({
            ...(this.state as any),
            serverErrors,
            serverErrorsTitle: errorTitle || this.defaultServerErrorsTitle,
        }, () => {
            if (scrollToErrors)
                this.scrollToElement(`[id="form-errors"]`);
        });
    }

    public toggleProcessing = (formProcessing: boolean) => {
        this.setState({ ...(this.state as any), formProcessing });
    }

    public triggerSubmit = () => {
        if (this.form !== null) {
            const formEl = ReactDOM.findDOMNode(this.form);
            if (formEl !== null && formEl !== undefined) {
                try {
                    formEl.dispatchEvent(new Event("submit", { cancelable: true }));
                }
                catch (err) {
                    const evt = document.createEvent("Event");
                    evt.initEvent("submit", false, true);
                    formEl.dispatchEvent(evt);
                }
            }
        }
    }

    public triggerBlur = (inputName: string) => {
        if (this.form !== null) {
            const formEl = ReactDOM.findDOMNode(this.form);
            if (formEl !== null && formEl !== undefined) {
                const matches = (formEl as Element).querySelectorAll(`[name="${inputName}"]`);
                if (matches.length) {
                    try {
                        matches[0].dispatchEvent(new Event("blur"));
                    }
                    catch (err) {
                        const evt = document.createEvent("Event");
                        evt.initEvent("submit", false, true);
                        matches[0].dispatchEvent(evt);
                    }
                }
            }
        }
    }

    public updateFormModel = (formModel: FormValidationModel<any>, callback?: () => void) => {
        this.setState({ ...(this.state as any), formModel }, callback);
    }

    public updateFormModelData = (data: any, callback?: () => void) => {
        this.setState({
            ...(this.state as any),
            modelChanged: true,
            formModel: {
                ...(this.state as OwnState).formModel,
                data,
            },
        }, () => {
            if (typeof callback === "function")
                callback();
        });
    }

    public updateFormModelDataAsync = (data: any) => {
        return new Promise((resolve) => {
            this.updateFormModelData(data, () => resolve());
        });
    }

}
