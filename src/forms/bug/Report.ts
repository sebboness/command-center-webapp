import * as yup from "yup";
import { FormValidationModel } from "../../models/validation";

export interface ReportData {
    description: string;
}

export class Report implements FormValidationModel<ReportData> {
    public data: ReportData;
    public rules: yup.Schema<ReportData>;

    public constructor() {
        this.data = {
            description: "",
        };
        this.rules = yup.object<ReportData>().shape({
            description: yup.string().required().label("Description").max(500),
        });
    }

    public mapToModel = (obj: any) => this.data;
    public modelToBody = () => ({});
}
