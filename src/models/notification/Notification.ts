import { ElementAnchorPositionType } from "../generic";

export type NotificationType = "danger" | "info" | "success" | "warning";

export interface Notification {
    icon?: string;
    id: number;
    message: string;
    show: boolean;
    target?: NotificationTarget;
    type: NotificationType;
}

export interface NotificationTarget {
    el: HTMLElement;
    anchorType: ElementAnchorPositionType;
}
