import * as moment from "moment";
import sentenceCase from "sentence-case";
import * as yup from "yup";
import { ReactSelectOption } from "../models/generic";

/**
 * Validation method that checks for equality of current field to another field
 * @param this Current schema
 * @param ref Reference fieldname
 * @param msg Optional error message
 */
export function equalTo(this: yup.MixedSchema, ref: yup.Ref, msg?: string) {
    function _test(this: any, value: any) {
        return value === this.resolve(ref);
    }

    return this.test({
        name: "equalTo",
        exclusive: false,
        message: msg || "${path} and ${reference} fields do not match",
        params: {
            reference: (ref as any).path,
        },
        test: _test,
    });
}

yup.addMethod(yup.mixed, "equalTo", equalTo);

/**
 * Method that validates string field as a phonenumber
 * @param this Current schema
 * @param ref Reference fieldname
 * @param msg Optional error message
 */
export function phoneNumber(this: yup.StringSchema, msg?: string) {
    const regex = new RegExp(/[^\d\-\s]|(^\-)|(\-$)/g);

    function _test(this: any, value?: string) {
        if (!value)
            return true;
        const matches = regex.exec(value);
        return matches === null || matches === undefined || matches.length === 0;
    }

    return this.test({
        name: "phoneNumber",
        exclusive: false,
        message: msg || "${path} is not a valid phone number. Only digits, dashes and spaces are allowed. Do not include country code.",
        test: _test,
    });
}

yup.addMethod(yup.string, "phoneNumber", phoneNumber);

/**
 * Method that validates maximum timespan (00:00:00) of a string
 * @param this Current schema
 * @param max Maximum timespan
 * @param msg Optional error message
 */
export function timespan_max(this: yup.StringSchema, max: number, msg?: string) {
    const controlValDisplay = moment("00:00", "HH:mm").to(moment("00:00", "HH:mm").add(max, "seconds"), true);

    function _test(this: any, value?: string) {
        if (!value)
            return true;

        let m = moment(value, "DD.HH:mm:ss");
        if (!m.isValid())
            m = moment(value, "HH:mm:ss");
        if (!m.isValid())
            m = moment(value, "mm:ss");
        if (!m.isValid())
            return false;

        const a = moment("00:00", "HH:mm");
        const diff = m.diff(a, "seconds", true);
        if (diff > max)
            return false;
        return true;
    }

    return this.test({
        name: "timespan_max",
        exclusive: false,
        message: msg || ("${path} must " + controlValDisplay + " maximum"),
        test: _test,
    });
}

yup.addMethod(yup.string, "timespan_max", timespan_max);

/**
 * Method that validates minimum timespan (00:00:00) of a string
 * @param this Current schema
 * @param min Minimum timespan
 * @param msg Optional error message
 */
export function timespan_min(this: yup.StringSchema, min: number, msg?: string) {
    const controlValDisplay = moment("00:00", "HH:mm").to(moment("00:00", "HH:mm").add(min, "seconds"), true);

    function _test(this: any, value?: string) {
        if (!value)
            return true;

        let m = moment(value, "DD.HH:mm:ss");
        if (!m.isValid())
            m = moment(value, "HH:mm:ss");
        if (!m.isValid())
            m = moment(value, "mm:ss");
        if (!m.isValid())
            return false;

        const a = moment("00:00", "HH:mm");
        const diff = m.diff(a, "seconds", true);
        if (diff < min)
            return false;
        return true;
    }

    return this.test({
        name: "timespan_min",
        exclusive: false,
        message: msg || ("${path} must be " + controlValDisplay + " minimum"),
        test: _test,
    });
}

yup.addMethod(yup.string, "timespan_min", timespan_min);

/**
 * Returns the label of the field in the yup validation schema.
 * @param schema The yup schema
 * @param path The path to the schema
 */
export const getFieldLabel = (schema: yup.Schema<any>, path: string) => {
    const nicePath = sentenceCase(path.replace(/.*(\[\d+\]\.)/, ""));
    try {
        const fieldSchema = yup.reach(schema, path);
        const label = (fieldSchema as any)["_label"] as string | undefined;
        return label || nicePath;
    }
    catch (err) {
        return nicePath;
    }
};

/**
 * Method that validates a required React-Select option
 * @param this Current schema
 * @param msg Optional error message
 */
export function requiredReactSelect(this: yup.StringSchema, msg?: string) {
    function _test(this: any, value?: ReactSelectOption) {
        if (!value || value.value === undefined || value.value === null || (typeof value.value === "string" && !value.value))
            return false;
        return true;
    }

    return this.test({
        name: "requiredReactSelect",
        exclusive: false,
        message: msg || ("${path} is required"),
        test: _test,
    });
}

yup.addMethod(yup.object, "requiredReactSelect", requiredReactSelect);
