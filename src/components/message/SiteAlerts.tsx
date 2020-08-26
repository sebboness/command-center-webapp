import { Alert } from ".";
import { List } from "immutable";
import * as React from "react";
import { connect } from "react-redux";
import * as redux from "redux";
import * as Actions from "../../actions";
import * as M from "../../models";
import { AppState } from "../../store";
import { DefaultConnectedDispatch, DefaultConnectedState, DefaultDispatchPropsMap, DefaultStatePropsMap } from "../base";
import { ReactHelper } from "../../utils";

const mapStateToProps = (state: AppState, ownProps: OwnProps | undefined): ConnectedState => ({
    ...DefaultStatePropsMap(state, ownProps),
    alerts: state.alert.alerts,
});

const mapDispatchToProps = (dispatch: redux.Dispatch<AppState>): ConnectedDispatch => ({
    ...DefaultDispatchPropsMap(dispatch),
    dismiss: (id: number) => dispatch(Actions.Alert.onDismissed(id)),
});

interface OwnProps {
}

type ConnectedState = DefaultConnectedState & {
    alerts: List<M.Alert.Alert>;
};

type ConnectedDispatch = DefaultConnectedDispatch & {
    dismiss: (id: number) => void;
};

interface OwnState {
}

type CombinedProps = ConnectedState & ConnectedDispatch & OwnProps;

class SiteAlertsComponent extends React.Component<CombinedProps, OwnState> {

    public constructor(props: any) {
        super(props);
        this.state = {
        };
    }

    public render() {
        const alerts = ReactHelper.ensureIsList(this.props.alerts);

        if (alerts.count((x: M.Alert.Alert) => !x.dismissed) === 0)
            return null;

        return alerts.map((x: M.Alert.Alert, i) => (
                <Alert
                    key={i}
                    onDismiss={() => this.props.dismiss(x.id)}
                    type={x.type}
                    title={x.title as any}
                    id={`site-alert-${x.id}`}
                >
                    {x.message}
                </Alert>
            ));
    }
}

export const SiteAlerts: React.ComponentClass<OwnProps> = connect(mapStateToProps, mapDispatchToProps)(SiteAlertsComponent);
