import { Notification } from "../../models/notification";

export interface NotificationState {
    lastId: number;
    notifications: Notification[];
}

export const initialNotificationState: NotificationState = {
    lastId: 0,
    notifications: [],
};
