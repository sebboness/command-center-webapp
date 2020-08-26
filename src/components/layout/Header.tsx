import Link from "next/link";
import Router from "next/router";
import * as React from "react";
import { connect } from "react-redux";
import * as redux from "redux";
import * as A from "../../actions";
import * as Comp from "../../components";
import * as Paths from "../../paths";
import routes from "../../routes";
import Settings from "../../settings";
import { AppState } from "../../store";
import { ReactHelper } from "../../utils";
import { Icon } from "../generic";
import { SiteSearch } from ".";

const mapStateToProps = (state: AppState, ownProps: OwnProps | undefined): ConnectedState => ({
    ...Comp.Base.DefaultStatePropsMap(state, ownProps),
    isHomePage: state.home.isHomePage,
});

const mapDispatchToProps = (dispatch: redux.Dispatch<AppState>): ConnectedDispatch => ({
    ...Comp.Base.DefaultDispatchPropsMap(dispatch),
    addBodyClass: (classList: string[]) => dispatch(A.Document.addBodyClass(classList)),
});

interface OwnProps {
}

type ConnectedState = Comp.Base.DefaultConnectedState & {
    isHomePage: boolean;
};

type ConnectedDispatch = Comp.Base.DefaultConnectedDispatch & {
    addBodyClass: (classList: string[]) => void;
};

interface OwnState {
}

type CombinedProps = ConnectedState & ConnectedDispatch & OwnProps;

class HeaderComponent extends React.Component<CombinedProps, OwnState> {

    public constructor(props: any) {
        super(props);
        this.state = {
        };
    }

    public render() {
        const auth: any = {}; // this.props.tokenData;

        return <header className="header">
            <div className="content">
                <div className="header-primary">
                    <div className="header-subbranding">
                        A project from the{" "}
                        <a href=""></a>
                    </div>

                    <Link href="/">
                        <a className="header-logo">
                            <img alt={Settings.ClientName} src="/content/images/logo.svg" />
                            <span className="header-tagline">Connecting the world</span>
                        </a>
                    </Link>
                </div>

                <nav className="nav-header">
                    <ul className="nav-extra">
                        <li>
                            <Comp.Bug.Report linkText="Share feedback" />
                        </li>
                        <li className="account-nav">
                            {auth.hasUserRecord
                                ? <>
                                    Welcome,{" "}
                                    <Link href=""><a>{auth.userFirstName}</a></Link>
                                    &nbsp;&nbsp;&nbsp;
                                    <Link href={Paths.Logout}><a>Sign out</a></Link>
                                </>
                                : <a href={Paths.Login} onClick={(e) => this.onSignInClick(e)}>Sign in</a>}
                        </li>
                    </ul>

                    {this.props.isHomePage
                        ? null
                        : <>
                            {/* <ul className="nav-primary">
                                <li>
                                    <routes.Link route={routes.Topics}><a>Topics</a></routes.Link>
                                </li>
                            </ul> */}
                            <div className="site-search">
                                <SiteSearch id="header-search" />
                            </div>
                        </>}

                    {/* <ul className="nav-primary">
                        <li>
                            <routes.Link route={routes.Topics}><a>Topics</a></routes.Link>
                        </li>
                    </ul>
                    <div className="site-search">
                        <SiteSearch api={this.props.api} id="header-search" />
                    </div> */}
                    <nav id="nav-toggle">
                        <ul>
                            <li>
                                <a href="#" id="toggle-menu" onClick={(e) => { ReactHelper.emptyClick(e); this.props.addBodyClass(["masked", "menu-open"]); }}>
                                    <Icon c="s" icon="bars" />
                                </a>
                            </li>

                            {this.props.isHomePage
                                ? null
                                : <li>
                                    <a href="#" id="toggle-search" onClick={(e) => { ReactHelper.emptyClick(e); this.props.addBodyClass(["masked", "search-open"]); }}>
                                        <Icon c="s" icon="search" />
                                    </a>
                                </li>}

                            {/* <li>
                                <a href="#" id="toggle-search" onClick={(e) => { ReactHelper.emptyClick(e); this.props.addBodyClass(["masked", "search-open"]); }}>
                                    <Icon c="s" icon="search" />
                                </a>
                            </li> */}
                        </ul>
                    </nav>
                </nav>
            </div>
        </header>;
    }

    private onSignInClick(e: React.MouseEvent<HTMLAnchorElement>) {
        const currentPath = Router.asPath || "/";
        const loginPath = Paths.Login;
        if (!(currentPath === loginPath || currentPath.indexOf(`${loginPath}?`) === 0)) {
            Router.push(`${loginPath}?returnUrl=${encodeURIComponent(Router.asPath || "/")}`);
        }
        return ReactHelper.emptyClick(e);
    }
}

export const Header: React.ComponentClass<OwnProps> = connect(mapStateToProps, mapDispatchToProps)(HeaderComponent);
