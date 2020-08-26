import { List } from "immutable";
import Router from "next/router";
import * as React from "react";
import { connect } from "react-redux";
import * as redux from "redux";
import * as A from "../actions";
import * as Comp from "../components";
import { NextContextWithStore } from "../interfaces";
import * as M from "../models";
import routes from "../routes";
import { AppState } from "../store";
import { ReactHelper, Utility } from "../utils";

const mapStateToProps = (state: AppState, ownProps: OwnProps | undefined): ConnectedState => ({
    ...Comp.Base.DefaultStatePropsMap(state, ownProps),
});

const mapDispatchToProps = (dispatch: redux.Dispatch<AppState>): ConnectedDispatch => ({
    ...Comp.Base.DefaultDispatchPropsMap(dispatch),
});

type ConnectedState = Comp.Base.DefaultConnectedState & {
    
};

type ConnectedDispatch = Comp.Base.DefaultConnectedDispatch & {
    
};

interface OwnProps {
    isSSR: boolean;
}

interface OwnState {
}

type CombinedProps = OwnProps & ConnectedState & ConnectedDispatch;

class HomePage extends React.Component<CombinedProps, OwnState> {

    public static async getInitialProps(ctx: NextContextWithStore) {
        if (ctx.req) {
            // ssr
            // await ctx.store.dispatch(A.Topic.loadTopics());
        }

        return {
            isSSR: !!ctx.req,
        };
    }

    public constructor(props: CombinedProps) {
        super(props);
        this.state = {
        };
    }

    public async componentDidMount() {
    }

    public componentWillUnmount() {
    }

    public render() {
        return <Comp.Layout.Layout title="Command Center">

        </Comp.Layout.Layout>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
