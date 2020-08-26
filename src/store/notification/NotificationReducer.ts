import * as actions from "./NotificationActions";
import { initialNotificationState, NotificationState } from "./NotificationState";
import * as M from "../../models";
import buildReducer from "../../utils/ReducerBuilder";

export const NotificationReducer = buildReducer<NotificationState>(initialNotificationState)
    .handle(actions.addNotificationAction, (state, action) => {
        if (action.payload === undefined)
            return { ...state };

        const notification: M.Notification.Notification = {
            id: action.payload.newId,
            icon: action.payload.icon,
            message: action.payload.message,
            show: false,
            target: action.payload.target,
            type: action.payload.type,
        };

        return {
            ...state,
            lastId: notification.id,
            notifications: [...state.notifications, notification],
        };
    })
    .handle(actions.hideNotificationAction, (state, action) => {
        if (action.payload === undefined)
            return { ...state };

        const notifications = state.notifications.map((n) => {
            if (n.id === action.payload)
                n.show = false;
            return n;
        });

        return {
            ...state,
            notifications,
        };
    })
    .handle(actions.removeNotificationAction, (state, action) => {
        if (action.payload === undefined)
            return { ...state };

        // filter out notification from the state with the corresponding ID
        const notifications = state.notifications.filter((n) => n.id !== action.payload);

        return {
            ...state,
            notifications,
        };
    })
    .handle(actions.showNotificationAction, (state, action) => {
        if (action.payload === undefined)
            return { ...state };

        const notifications = state.notifications.map((n) => {
            if (n.id === action.payload)
                n.show = true;
            return n;
        });

        return {
            ...state,
            notifications,
        };
    })
    .done();
