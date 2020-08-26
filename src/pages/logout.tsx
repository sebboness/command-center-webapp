import { NextContext } from "next";
import Router from "next/router";
import * as React from "react";
import { connect, ProviderProps } from "react-redux";
import * as redux from "redux";
import * as Actions from "../actions";
import * as Comp from "../components";
import { AppState } from "../store";

const mapStateToProps = (state: AppState, ownProps: OwnProps | undefined): ConnectedState => ({
    ...Comp.Base.DefaultStatePropsMap(state, ownProps),
});

const mapDispatchToProps = (dispatch: redux.Dispatch<AppState>): ConnectedDispatch => ({
    ...Comp.Base.DefaultDispatchPropsMap(dispatch),
    logout: () => {}, // dispatch(Actions.Auth.logOut()),
});

interface OwnProps {
}

type ConnectedState = Comp.Base.DefaultConnectedState & {
};

type ConnectedDispatch = Comp.Base.DefaultConnectedDispatch & {
    logout: () => void;
};

interface OwnState {
}

type CombinedProps = ConnectedState & ConnectedDispatch & OwnProps;

class LogoutComponent extends React.Component<CombinedProps, OwnState> {

    public static async getInitialProps(ctx: NextContext & ProviderProps) {
        // then logout user
        // await ctx.store!.dispatch(Actions.Auth.logOut());

        if (ctx.res) {
            console.log("logout server");
            // await AuthHelper.clearLegacyAuthCookie(ctx.res);
            if (ctx.res.writeHead)
                ctx.res.writeHead(302, { Location: "/" });
            if (ctx.res.end)
                ctx.res.end();
        }
        else if (ctx.store) {
            console.log("logout client");
            // await AuthHelper.clearTokenFromCookie();
            // await ctx.store!.dispatch(Actions.Auth.init());
            Router.push("/");
        }

        return {};
    }

    public constructor(props: any) {
        super(props);
    }

    public render() {
        return null;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LogoutComponent);
