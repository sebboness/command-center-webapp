import React from "react";
import * as redux from "redux";
import * as A from "../../actions";
import * as M from "../../models";
import { AppState } from "../../store";

export const DefaultStatePropsMap = (state: AppState, ownProps: OwnProps | undefined): DefaultConnectedState => ({
    
});

export const DefaultDispatchPropsMap = (dispatch: redux.Dispatch<AppState>): DefaultConnectedDispatch => ({
    alertError: (msg: M.Alert.AlertMessage, title?: M.Alert.AlertTitle) => dispatch(A.Alert.error(msg, title)),
    alertInfo: (msg: M.Alert.AlertMessage, title?: M.Alert.AlertTitle) => dispatch(A.Alert.info(msg, title)),
    alertSuccess: (msg: M.Alert.AlertMessage, title?: M.Alert.AlertTitle) => dispatch(A.Alert.success(msg, title)),
    alertWarn: (msg: M.Alert.AlertMessage, title?: M.Alert.AlertTitle) => dispatch(A.Alert.warn(msg, title)),
    forceAuthRefresh: () => {}, //dispatch(A.Auth.forceAuthRefresh()),
    notify: (message: string, type: M.Notification.NotificationType, target?: M.Notification.NotificationTarget) =>
        dispatch(A.Noti.addNotification({ message, target, type })),
    notifyError: (message: string, icon?: string) => dispatch(A.Noti.notifyError(message, icon)),
    notifyInfo: (message: string, icon?: string) => dispatch(A.Noti.notifyInfo(message, icon)),
    notifySuccess: (message: string, icon?: string) => dispatch(A.Noti.notifySuccess(message, icon)),
    notifyWarning: (message: string, icon?: string) => dispatch(A.Noti.notifyWarning(message, icon)),
});

export interface DefaultConnectedState {
    
}

export interface DefaultConnectedDispatch {
    alertError: (msg: M.Alert.AlertMessage, title?: M.Alert.AlertTitle) => void;
    alertInfo: (msg: M.Alert.AlertMessage, title?: M.Alert.AlertTitle) => void;
    alertSuccess: (msg: M.Alert.AlertMessage, title?: M.Alert.AlertTitle) => void;
    alertWarn: (msg: M.Alert.AlertMessage, title?: M.Alert.AlertTitle) => void;
    forceAuthRefresh: () => void;
    notify: (message: string, type: M.Notification.NotificationType, target?: M.Notification.NotificationTarget) => void;
    notifyError: (message: string, icon?: string) => void;
    notifyInfo: (message: string, icon?: string) => void;
    notifySuccess: (message: string, icon?: string) => void;
    notifyWarning: (message: string, icon?: string) => void;
}

interface OwnProps {
}

interface OwnState {
    errors?: string[];
    errorsTitle?: string;
    loading?: boolean;
}

export class BaseComponent<TProps, TState> extends React.Component<TProps & OwnProps, TState & OwnState> {

    /** Tracks mounted state of component */
    public _isMounted = false;

    private loadingTimer?: NodeJS.Timer;

    public constructor(props: any) {
        super(props);
    }

    public clearErrors() {
        this.setErrors([]);
    }

    public async clearStateAsync() {
        await this.setStateAsync({
            ...this.state,
            errors: undefined,
            errorsTitle: undefined,
            loading: undefined,
        });
    }

    public getErrorAlert() {
        return null; // <ErrorAlert errors={this.state.errors} title={this.state.errorsTitle} />;
    }

    public hasErrors() {
        return (this.getState().errors || []).length > 0;
    }

    public lastPathIsFrom(lastPath: string | undefined, pathInQuestion: string) {
        if (!lastPath)
            return false;
        return lastPath === pathInQuestion || lastPath.indexOf(`${pathInQuestion}?`) === 0;
    }

    public setErrors(errors: string[], title?: string) {
        this.setState(Object.assign(this.state, { errors, errorsTitle: title }));
    }

    public setStateAsync(newState: TState & OwnState) {
        return new Promise((resolve, reject) => {
            try {
                this.setState({
                    ...(this.state as any),
                    ...(newState as any),
                }, () => {
                    resolve(this.state);
                });
            }
            catch (err) {
                reject(err);
            }
        });
    }

    /**
     * Toggles loading state
     * @param doShow Whether to set loading to true or false
     * @param [timeout] Time after which to set loading state. Defaults to 275.
     */
    public toggleLoading(doShow: boolean, timeout: number = 275) {
        if (!this._isMounted)
            return;

        if (doShow) {
            // loading = true
            if (this.loadingTimer !== undefined)
                clearTimeout(this.loadingTimer);

            this.loadingTimer = setTimeout(() => {
                if (this._isMounted)
                    this.setState(Object.assign(this.state, { loading: true }));
            }, timeout);
        }
        else {
            // loading = false
            if (this.loadingTimer !== undefined)
                clearTimeout(this.loadingTimer);
            if (this._isMounted)
                this.setState(Object.assign(this.state, { loading: false }));
        }
    }

    public async toggleLoadingAsync(loading: boolean) {
        await this.setStateAsync({
            ...this.state,
            loading,
        });
    }

    private getState() {
        return this.state as OwnState;
    }
}
