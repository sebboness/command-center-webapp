import { createAction } from "redux-actions";
import { Thunk } from "../../actions/Thunk";
import { NotificationTarget, NotificationType } from "../../models/notification";
import Settings from "../../settings";
import { ServerResponse } from "http";
import { Cookie } from "../../utils/Cookie";

const prefix = "NOTIFICATION_";

class Constants {
    public static ADD: string = prefix + "ADD";
    public static REMOVE: string = prefix + "REMOVE";
    public static HIDE: string = prefix + "HIDE";
    public static SHOW: string = prefix + "SHOW";
    public static COOKIENAME = Settings.LocalStorageKeyPrefix + "notifications";
}

export interface NotificationOptions {
    icon?: string;
    message: string;
    target?: NotificationTarget;
    type: NotificationType;
}

export interface NotificationAddPayload {
    icon?: string;
    message: string;
    newId: number;
    target?: NotificationTarget;
    timeout?: number;
    type: NotificationType;
}

export interface NotificationKillTimerPayload {
    notificationId: number;
    timeout?: number;
}

export type NotificationRemovePayload = number;

/**
 * Adds a notification to the list
 * @param notificationOpts The notification options
 * @param timeout Optional timeout of when to hide the notification
 * @param persist Optional flag that will persist the notification in local storage (for retrieval on reload)
 */
export const addNotification = (notificationOpts: NotificationOptions, timeout?: number): Thunk => async (dispatch, getState) => {
    const newId = getState().notification.lastId + 1;
    await dispatch(addNotificationAction({ ...notificationOpts, newId }));

    // kickoff timer to show notifications
    setTimeout(() => {
        dispatch(showNotificationAction(newId));
    }, 50);

    // kickoff notification kill timer
    await dispatch(startNotificationKillTimer(newId, timeout));
};

export const init = (): Thunk => async (dispatch, getState) => {
    // retrieve persisted notifications from local storage
    const notifications = Cookie.getAs<NotificationOptions[]>(Constants.COOKIENAME);
    if (notifications && notifications.length) {
        for (const n of notifications)
            await dispatch(addNotification(n));
    }

    // clear persisted notifications from local storage
    Cookie.clear(Constants.COOKIENAME, Settings.CookieDomain);
};

export const notifyError = (message: string, icon?: string, timeout?: number): Thunk => async (dispatch, getState) => {
    await dispatch(addNotification({ icon, message, type: "danger" }, timeout));
};

export const notifyInfo = (message: string, icon?: string, timeout?: number): Thunk => async (dispatch, getState) => {
    await dispatch(addNotification({ icon, message, type: "info" }, timeout));
};

export const notifySuccess = (message: string, icon?: string, timeout?: number): Thunk => async (dispatch, getState) => {
    await dispatch(addNotification({ icon, message, type: "success" }, timeout));
};

export const notifyWarning = (message: string, icon?: string, timeout?: number): Thunk => async (dispatch, getState) => {
    await dispatch(addNotification({ icon, message, type: "warning" }, timeout));
};

export const addNotificationAction = createAction<NotificationAddPayload, NotificationAddPayload>(
    Constants.ADD, (result) => (result),
);

export const hideNotificationAction = createAction<number, number> (
    Constants.HIDE, (notificationId) => (notificationId),
);

export const removeNotificationAction = createAction<number, number> (
    Constants.REMOVE, (notificationId) => (notificationId),
);

export const showNotificationAction = createAction<number, number> (
    Constants.SHOW, (notificationId) => (notificationId),
);

export const persist = (res: ServerResponse): Thunk => async (dispatch, getState) => {
    const json = JSON.stringify(getState().notification.notifications);

    const options = {
        maxAge: 1000 * 60 * 60 * 24 * 1, // Expire after 30 days
        httpOnly: false,
        domain: Settings.CookieDomain,
    };

    // Set cookie
    (res as any).cookie(Constants.COOKIENAME, json, options);
};

export const startNotificationKillTimer = (notificationId: number, timeout?: number): Thunk => (dispatch, getState) => {
    setTimeout(() => {
        dispatch(hideNotificationAction(notificationId));
    }, timeout || 5000);
};
