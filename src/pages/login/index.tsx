import Router from "next/router";
import * as React from "react";
import { connect } from "react-redux";
import * as BS from "reactstrap";
import * as redux from "redux";
import * as Actions from "../../actions";
import * as Comp from "../../components";
import SignInLayout from "../../components/layout/SignInLayout";
import { NextContextWithStore } from "../../interfaces";
import routes from "../../routes";
import { AppState } from "../../store";

const mapStateToProps = (state: AppState, ownProps: OwnProps | undefined): ConnectedState => ({
    ...Comp.Base.DefaultStatePropsMap(state, ownProps),
    // isLoggedIn: (state.auth.data)
    //     ? state.auth.data.hasUserRecord
    //     : false,
    isLoggedIn: false,
});

const mapDispatchToProps = (dispatch: redux.Dispatch<AppState>): ConnectedDispatch => ({
    ...Comp.Base.DefaultDispatchPropsMap(dispatch),
    onAuthSuccess: (accessToken: string, refreshToken: string) => {}, // dispatch(Actions.Auth.postAuthorize(accessToken, refreshToken)),
});

type ConnectedState = Comp.Base.DefaultConnectedState & {
    isLoggedIn: boolean;
};

type ConnectedDispatch = Comp.Base.DefaultConnectedDispatch & {
    onAuthSuccess: (accessToken: string, refreshToken: string) => void;
};

interface OwnProps {
    host: string;
    returnUrl: string;
}

interface OwnState {
    host: string;
    returnUrl: string;
}

type CombinedProps = OwnProps & ConnectedDispatch & ConnectedState;

class LogInPage extends React.Component<CombinedProps, OwnState> {

    public static async getInitialProps(ctx: NextContextWithStore) {
        const auth = undefined; // ctx.store.getState().auth.data;

        const host = ctx.req
            ? (ctx.req.protocol + "://" + ctx.req.headers["host"])
            : window.location.href.substr(0, window.location.href.indexOf("/", 10));

        let returnUrl = routes.get(routes.Home).toPath();

        if (ctx.query.returnUrl)
            returnUrl = decodeURIComponent((ctx.query.returnUrl + "") || "/");

        if (auth) { // && auth.hasUserRecord) {
            // not logged in
            if (ctx.res) {
                // server-side redirect
                // const url = URL.parse(ctx.req!.url || "/");
                // console.log("search", url.search);
                // console.log("query", url.query);
                // const query = QS.parse(url.search || "") as any;
                if (ctx.res.writeHead)
                    ctx.res.writeHead(302, { Location: returnUrl });
                if (ctx.res.end)
                    ctx.res.end();
            }
            else {
                // client-side redirect
                // const returnUrl = ((Router.router as RouterProps).query || {}).returnUrl as string | undefined;
                Router.push(returnUrl);
            }
        }

        return {
            host,
            returnUrl,
        };
    }

    private collTimeout = 125;

    public constructor(props: CombinedProps) {
        super(props);
        this.state = {
            host: props.host,
            returnUrl: props.returnUrl,
        };
    }

    public componentDidMount() {
    }

    public componentWillUnmount() {
    }

    public render() {
        return <SignInLayout title="Sign in">
            {/* <BS.Collapse isOpen={!userChecked} timeout={this.collTimeout}>
                <div>
                    <EmailForm
                        onSuccess={(user) => this.onEmailSuccess(user)}
                        host={this.state.host}
                        returnUrl={this.state.returnUrl}
                        user={this.state.checkedUser}
                    />
                </div>
            </BS.Collapse>

            <BS.Collapse isOpen={userChecked} timeout={this.collTimeout}>
                <div>
                    <PasswordForm
                        onSuccess={(accessToken, refreshToken) => this.onPasswordVerified(accessToken, refreshToken)}
                        onUserChange={() => this.onUserChange()}
                        returnUrl={this.props.host + this.state.returnUrl}
                        user={this.state.checkedUser}
                    />
                </div>
            </BS.Collapse> */}
        </SignInLayout>;
    }

    private onPasswordVerified(accessToken: string, refreshToken: string) {
        this.props.onAuthSuccess(accessToken, refreshToken);
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LogInPage);
