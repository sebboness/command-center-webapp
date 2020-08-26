import * as React from "react";
import { connect } from "react-redux";
import * as redux from "redux";
import * as Actions from "../../actions";
import { AppState } from "../../store";

const mapStateToProps = (state: AppState, ownProps: OwnProps | undefined): ConnectedState => ({
});

const mapDispatchToProps = (dispatch: redux.Dispatch<AppState>): ConnectedDispatch => ({
    updateWindowSize: () => dispatch(Actions.Document.windowSizeUpdated()),
});

interface OwnProps {
}

interface ConnectedState {
}

interface ConnectedDispatch {
    updateWindowSize: () => void;
}

interface OwnState {
}

class ResponsiveComponent extends React.Component<ConnectedState & ConnectedDispatch & OwnProps, OwnState> {

    public componentDidMount() {
        if (typeof window !== "undefined") {
            const handler = this.props.updateWindowSize;
            window.addEventListener("resize", () => handler());
        }
    }

    public componentWillUnmount(){
        if (typeof window !== "undefined") {
            const handler = this.props.updateWindowSize;
            window.removeEventListener("resize", () => handler());
        }
    }

    public render() {
        return null;
    }
}

export const Responsive: React.ComponentClass<OwnProps> = connect(mapStateToProps, mapDispatchToProps)(ResponsiveComponent);
