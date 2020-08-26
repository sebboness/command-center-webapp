import { createAction } from "redux-actions";
import { Thunk } from "../../actions";
import { AlertMessage, AlertTitle, AlertType } from "../../models/alert";

const prefix = "ALERT_";

export class Constants {
    public static CLEAR_ALL = prefix + "CLEAR_ALL";
    public static DISMISSED = prefix + "DISMISSED";
    public static UPDATED_ALERTS = prefix + "UPDATED_ALERTS";
}

interface AlertPayload {
    message: AlertMessage;
    title?: AlertTitle;
    type: AlertType;
}

export const success = (msg: AlertMessage, title?: AlertTitle): Thunk => async (dispatch, _getState) => {
    return await dispatch(onNewAlert(msg, "success", title));
};

export const error = (msg: AlertMessage, title?: AlertTitle): Thunk => async (dispatch, _getState) => {
    return await dispatch(onNewAlert(msg, "danger", title));
};

export const info = (msg: AlertMessage, title?: AlertTitle): Thunk => async (dispatch, _getState) => {
    return await dispatch(onNewAlert(msg, "info", title));
};

export const warn = (msg: AlertMessage, title?: AlertTitle): Thunk => async (dispatch, _getState) => {
    return await dispatch(onNewAlert(msg, "warning", title));
};

export const onClearAll = createAction(
    Constants.CLEAR_ALL,
);

export const onNewAlert = createAction<AlertPayload, AlertMessage, AlertType, AlertTitle>(
    Constants.UPDATED_ALERTS, (message, type, title) => ({ message, type, title }),
);

export const onDismissed = createAction<number, number>(
    Constants.DISMISSED, (id) => (id),
);
