// import polyfils, etc
import "cookie-parser";
import "isomorphic-unfetch";

// import style sheets
import "react-placeholder/lib/reactPlaceholder.css";
import "../../content/styles/master.css";
import "../../content/styles/site-notifications.css";

import { List } from "immutable";
import withRedux from "next-redux-wrapper";
import { AppComponentProps, Container, DefaultAppIProps, NextAppContext } from "next/app";
import Router from "next/router";
import React from "react";
import { connect, Provider } from "react-redux";
import { Store } from "redux";
import * as redux from "redux";
import * as A from "../actions";
import { initStore } from "../initStore";
import Settings from "../settings";
import { AppState } from "../store";
import { GAHelper, Utility } from "../utils";

let pingerRunning = false;

const mapStateToProps = (_state: AppState, _ownProps: OwnProps | undefined): ConnectedState => ({
});

const mapDispatchToProps = (dispatch: redux.Dispatch<AppState>): ConnectedDispatch => ({
    clearAllAlerts: () => dispatch(A.Alert.onClearAll()),
    initNotifications: () => dispatch(A.Noti.init()),
    setIsHomePage: (isHomePage: boolean) => dispatch(A.Home.setIsHomePage(isHomePage)),
});

interface OwnProps {
    store: Store<AppState>;
}

interface ConnectedState {
}

interface ConnectedDispatch {
    clearAllAlerts: () => void;
    initNotifications: () => void;
    setIsHomePage: (isHomePage: boolean) => void;
}

type CombinedProps = ConnectedState & ConnectedDispatch & OwnProps;

class MyApp extends React.Component<CombinedProps & AppComponentProps & DefaultAppIProps> {
    public static async getInitialProps(appCtx: NextAppContext & { ctx: { store: Store<AppState> }}) {
        // console.log("App wrapper");

        return new Promise(async (resolve) => {
            if (appCtx.ctx.req && appCtx.ctx.res) {
                // server side
                const url = appCtx.ctx.req.url || "/";
                if (url === "/" || url.startsWith("/?"))
                    await appCtx.ctx.store.dispatch(A.Home.setIsHomePage(true));
                else
                    await appCtx.ctx.store.dispatch(A.Home.setIsHomePage(false));
            }
            else {
                // client side
            }

            resolve({
                pageProps: (appCtx.Component.getInitialProps ? await appCtx.Component.getInitialProps(appCtx.ctx) : {}),
            });
        });
    }

    /** Stores the last path visited */
    private _lastPath: string = this.getBasePath(Utility.isServer() ? "" : (Router as any).router.asPath);

    public constructor(props: any) {
        super(props);

        if (!Utility.isServer()) {
            if (("onhashchange" in window) && navigator.userAgent.toLowerCase().indexOf("msie") === -1) {
                // hashchange event supported
                window.onhashchange = function() {
                    // Google analytics tracking
                    GAHelper.track(window.location);
                };
            }

            Router.events.on("routeChangeComplete", () => {
                // Google analytics tracking
                GAHelper.track(window.location);

                if ((Router as any).router.asPath !== this._lastPath) {
                    // scroll to top if path changed
                    const newPath = this.getBasePath((Router as any).router.asPath);
                    const doScroll = newPath !== this._lastPath;

                    if (doScroll) {
                        window.scrollTo(0, 0);
                        this._lastPath = newPath;

                        // clear all alert messages
                        this.props.clearAllAlerts();
                    }
                }
            });
        }
    }

    public async componentDidMount() {
        await this.props.initNotifications();

        this.startPingService();
    }

    public async componentWillMount() {
        if (!Utility.isServer()) {
            if (Router.router!.route === "/")
                await this.props.setIsHomePage(true);
            else
                await this.props.setIsHomePage(false);
        }
    }

    public async componentDidUpdate() {
        if (Router.router!.route === "/")
            await this.props.setIsHomePage(true);
        else
            await this.props.setIsHomePage(false);
    }

    public render() {
        const { Component, pageProps, store } = this.props;
        return <Container>
            <Provider store={store}>
                <Component {...pageProps} />
            </Provider>
        </Container>;
    }

    private getBasePath(path: string) {
        const qMarkIdx = path.indexOf("?");
        if (qMarkIdx > -1)
            path = path.substr(0, qMarkIdx);
        return path;
    }

    private startPingService() {
        if (!pingerRunning) {
            // setup promise to ping server
            const ping = () => new Promise((_resolve, _reject) => {
                const init: RequestInit = {
                    credentials: "include", // needed to send along cookies
                    headers: {
                        Referer: Settings.ClientUrl,
                    },
                    method: "Get",
                };

                const url = `${Settings.ClientUrl}/ping`;
                return fetch(url, init);
            });

            // ping the server to avoid server running into out-of-memory and connection timed out issues.
            setInterval(async () => {
                await ping();
            }, 1000 * 120); // every 2 minutes
            pingerRunning = true;

            // console.info("Ping service started");
        }
    }
}

export default withRedux(initStore)(connect(mapStateToProps, mapDispatchToProps)(MyApp));
