import { List } from "immutable";
import * as actions from "./AlertActions";
import { AlertState, initialAlertState } from "./AlertState";
import * as M from "../../models";
import { ReactHelper } from "../../utils";
import buildReducer from "../../utils/ReducerBuilder";

export const AlertReducer = buildReducer<AlertState>(initialAlertState)
    .handle(actions.onClearAll, (state, action) => ({
        ...state,
        alerts: List(),
    }))
    .handle(actions.onNewAlert, (state, action) => {
        if (action.payload === undefined)
            return state;

        const alerts = ReactHelper.ensureIsList(state.alerts);

        const alert: M.Alert.Alert = {
            id: alerts.size + 1,
            date: new Date().valueOf(),
            dismissed: false,
            message: action.payload.message,
            title: action.payload.title,
            type: action.payload.type,
        };

        console.log(alerts);

        return {
            ...state,
            alerts: alerts.push(alert),
        };
    })
    .handle(actions.onDismissed, (state, action) => {
        const alerts = ReactHelper.ensureIsList(state.alerts);
        const idx = alerts.findIndex((x) => x !== undefined && x.id === action.payload!);
        let alert: M.Alert.Alert | undefined;
        if (idx > -1)
            alert = alerts.get(idx);

        if (alert) {
            alert = Object.assign({}, alert);
            alert.dismissed = true;
        }

        return {
            ...state,
            alerts: alert
                ? alerts.set(idx, alert)
                : alerts,
        };
    })
    .done();
