import * as yup from "yup";
import { ReactSelectOption } from "../../models/generic";

export const ReactSelectOptionSchema = yup.object<ReactSelectOption>().nullable(true).shape({
    value: yup.mixed(),
    label: yup.string(),
});
