export type ResultType = "Success" | "Error" | "ValidateFailed" | "AuthenticationRequired" | "AccessDenied";

export interface IIResult {
    errorCode: number;
    errors: string[];
    isSuccess: boolean;
    message?: string;
    type: ResultType;
}

export interface IResult<T> extends IIResult {
    data?: T;
}

export class Result<T> implements IResult<T> {
    public data?: T;
    public errorCode: number = 0;
    public errors: string[] = [];
    public isSuccess = false;
    public message?: string;
    public type: ResultType = "Error";

    public constructor(data?: T, type?: ResultType) {
        this.data = data;
        this.type = type || "Success";
        this.isSuccess = this.type === "Success";
    }
}

export const isConnectionFail = (r: IResult<any>): boolean => {
    return r.type === "Error"
        && ((r.message || "").toLowerCase().indexOf("failed to fetch") > -1
            || (r.message || "").indexOf("ECONNREFUSED") > -1);
};

export const resultToErrors = (r: IResult<any>): string[] => {
    return r.errors && r.errors.length
        ? r.errors
        : (r.message ? [r.message] : []);
};
