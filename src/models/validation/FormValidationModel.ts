import * as yup from "yup";

export interface FormValidationModel<T> {
    data: T;
    rules: yup.Schema<T>;
    mapToModel: (data: any) => T;
    modelToBody: () => any;
}
