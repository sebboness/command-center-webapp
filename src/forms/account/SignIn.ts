import * as yup from "yup";
import { FormValidationModel } from "../../models/validation";

export interface SignInEmailData {
    username: string;
}

export class SignInEmail implements FormValidationModel<SignInEmailData> {
    public data: SignInEmailData;
    public rules: yup.Schema<SignInEmailData>;

    public constructor() {
        this.data = {
            username: "",
        };
        this.rules = yup.object<SignInEmailData>().shape({
            username: yup.string().email().required().label("Email"),
        });
    }

    public mapToModel = (obj: any) => this.data;
    public modelToBody = () => ({});
}

export interface SignInPasswordData {
    password: string;
}

export class SignInPassword implements FormValidationModel<SignInPasswordData> {
    public data: SignInPasswordData;
    public rules: yup.Schema<SignInPasswordData>;

    public constructor() {
        this.data = {
            password: "",
        };
        this.rules = yup.object<SignInPasswordData>().shape({
            password: yup.string().required("Please enter your password").label("Please enter your password"),
        });
    }

    public mapToModel = (obj: any) => this.data;
    public modelToBody = () => ({});
}
