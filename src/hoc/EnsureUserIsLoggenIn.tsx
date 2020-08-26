import { NextStaticLifecycle } from "next";
import Router from "next/router";
import * as React from "react";
import { connect } from "react-redux";
import { compose, Dispatch } from "redux";
import * as URL from "url";
import { NextContextWithStore } from "../interfaces";
import { AppState } from "../store";

const mapStateToProps = (state: AppState, ownProps: OwnProps | undefined): ConnectedState => ({
    isLoggedIn: false, // !!state.auth.data && state.auth.data.hasUserRecord,
});

const mapDispatchToProps = (dispatch: Dispatch<AppState>): ConnectedDispatch => ({
});

interface ConnectedState {
    isLoggedIn: boolean;
}

interface ConnectedDispatch {
}

interface OwnProps {
    ok: number;
}

type CombinedProps = OwnProps & ConnectedDispatch & ConnectedState;

export const ensureUserIsLoggedIn = <P extends object>(Component: React.ComponentType<P>) => {
    class WithLoginRequired extends React.Component<P & CombinedProps> {
        public static async getInitialProps(ctx: NextContextWithStore) {
            const auth = undefined; // ctx.store.getState().auth.data;

            if (!auth) { // || !auth.hasUserRecord) {
                // not logged in
                if (ctx.req && ctx.res) {

                    // server-side redirect
                    const path = URL.parse(ctx.req!.url || "/").pathname;
                    if (ctx.res.writeHead)
                        ctx.res.writeHead(302, {
                            Location: "/login?returnUrl=" + encodeURIComponent(path || "/"),
                        });
                    if (ctx.res.end)
                        ctx.res.end();
                }
                else {
                    // client-side redirect
                    Router.push("/login?returnUrl=" + encodeURIComponent(ctx.asPath || "/"));
                }

                return {};
            }

            const c = Component as NextStaticLifecycle<any, any>;
            return c.getInitialProps ? await c.getInitialProps(ctx) : {};
        }

        public constructor(props: CombinedProps) {
            super(props as any);
            this.state = {
            };
        }

        public render() {
            return <Component { ...this.props } />;
        }
    }

    return compose(
        connect(mapStateToProps, mapDispatchToProps),
    )(WithLoginRequired as any);
};
