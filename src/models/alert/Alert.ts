export type AlertType = "primary" | "secondary" | "light" | "dark" | "danger" | "info" | "success" | "warning";
export type AlertMessage = string | JSX.Element;
export type AlertTitle = undefined | string | JSX.Element;

export interface Alert {
    date: number;
    dismissed: boolean;
    id: number;
    message: AlertMessage;
    title: AlertTitle;
    type: AlertType;
}
