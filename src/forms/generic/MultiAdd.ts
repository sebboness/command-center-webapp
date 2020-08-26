import * as yup from "yup";

export interface MultiAddModel {
    index: number;
    isDeleted: boolean;
}

export const MultiAddSchema: { [field in keyof MultiAddModel]: any } = {
    index: yup.number(),
    isDeleted: yup.bool(),
};
