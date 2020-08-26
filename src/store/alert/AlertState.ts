import { List } from "immutable";
import { Alert } from "../../models/alert";

export interface AlertState {
    alerts: List<Alert>;
}

export const initialAlertState: AlertState = {
    alerts: List(),
};
