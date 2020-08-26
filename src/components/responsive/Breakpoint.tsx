import * as _ from "lodash";
import * as React from "react";
import { connect } from "react-redux";
import * as redux from "redux";
import Settings from "../../settings";
import { AppState } from "../../store";

const mapStateToProps = (state: AppState, ownProps: OwnProps | undefined): ConnectedState => ({
    width: state.doc.width,
});

const mapDispatchToProps = (dispatch: redux.Dispatch<AppState>): ConnectedDispatch => ({
});

interface OwnProps {
    maxWidth?: boolean | number;
    minWidth?: boolean | number;
}

interface ConnectedState {
    width: number;
}

interface ConnectedDispatch {
}

interface OwnState {
}

class BreakpointComponent extends React.Component<ConnectedState & ConnectedDispatch & OwnProps, OwnState> {
    public render() {
        if (this.props.maxWidth === undefined && this.props.minWidth === undefined) {
            throw new Error ("Breakpoint: {maxWidth} or {minWidth} property must be defined for component");
        }

        if (typeof window !== "undefined") {
            let maxWidth = typeof this.props.maxWidth === "number" ? this.props.maxWidth : Number.MAX_SAFE_INTEGER;
            let minWidth = typeof this.props.minWidth === "number" ? this.props.minWidth : 0;
            const width = this.props.width;

            // if maxWidth / minWidth are boolean flags, fill with default breakpoint widths
            if (_.isBoolean(this.props.maxWidth))
                maxWidth = Settings.ResponsiveBreakpointWidth;
            if (_.isBoolean(this.props.minWidth))
                minWidth = Settings.ResponsiveBreakpointWidth + 1;

            // constrain by max width
            if (width && width > maxWidth)
                return null;
            // constrain by min width
            if (width && width < minWidth)
                return null;
        }

        return this.props.children;
    }
}

export const Breakpoint: React.ComponentClass<OwnProps> = connect(mapStateToProps, mapDispatchToProps)(BreakpointComponent);
