import * as React from "react";
import { connect } from "react-redux";
import { Alert, Fade } from "reactstrap";
import * as redux from "redux";
import { Notification } from "../../models/notification";
import { AppState } from "../../store";
import * as notificationActions from "../../store/notification/NotificationActions";
import { Utility } from "../../utils";

const mapStateToProps = (state: AppState, _ownProps: OwnProps | undefined): ConnectedState => ({
    notifications: state.notification.notifications,
});

const mapDispatchToProps = (dispatch: redux.Dispatch<AppState>): ConnectedDispatch => ({
    dismissNotification: (notificationId: number) => {
        dispatch(notificationActions.removeNotificationAction(notificationId));
    },
    hideNotification: (notificationId: number) => {
        dispatch(notificationActions.hideNotificationAction(notificationId));
    },
});

interface OwnProps {
}

interface OwnState {
}

interface ConnectedState {
    notifications: Notification[];
}

interface ConnectedDispatch {
    dismissNotification: (notificationId: number) => void;
    hideNotification: (notificationId: number) => void;
}

interface OwnState {
}

export class SiteNotificationsComponent extends React.Component<ConnectedState & ConnectedDispatch & OwnProps, OwnState> {

    public render() {
        // -webkit-transform: translateY(100%);
        // transform: translateY(100%);

        if (!this.props.notifications.length)
            return null;

        const notifications = this.props.notifications.map((n) => {
            const iconEl = n.icon
                ? <i className={"fa fa-" + n.icon}></i>
                : null;

            let className = "";
            let styles: React.CSSProperties = {};

            // compute custom positioning if a target element has been provided
            if (n.target) {
                styles = {
                    margin: "0",
                    position: "absolute",
                };

                const anchorPos = Utility.getElementAnchorPosition(n.target.el, n.target.anchorType);
                styles = {
                    top: anchorPos.top,
                    left: anchorPos.left,
                };

                className = "target " + n.target.anchorType;
            }

            return <Fade key={n.id} in={n.show} timeout={125} onExited={() => this.props.dismissNotification(n.id)}>
                <div className="item">
                    <Alert color={n.type} className={className} onClick={() => this.handleNotificationHide(n.id)} style={styles}>
                        {iconEl}{(n.icon ? " " : "")}<span dangerouslySetInnerHTML={{ __html: n.message }}></span>
                    </Alert>
                </div>
            </Fade>;
        });

        return <div className="site-notifications-wrapper">
                <div className="site-notifications">
                    {notifications}
                </div>
            </div>;
    }

    private handleNotificationHide(id: number) {
        this.props.hideNotification(id);
        setTimeout(() => this.props.dismissNotification(id), 250);
    }
}

export const SiteNotifications: React.ComponentClass<OwnProps> = connect(mapStateToProps, mapDispatchToProps)(SiteNotificationsComponent);
