import * as Comp from "..";
import Link from "next/link";
import Router from "next/router";
import * as React from "react";
import { connect } from "react-redux";
import * as redux from "redux";
import * as A from "../../actions";
import * as Paths from "../../paths";
import routes from "../../routes";
import { AppState } from "../../store";
import { ReactHelper } from "../../utils";
import { Icon } from "../generic";

const mapStateToProps = (state: AppState, ownProps: OwnProps | undefined): ConnectedState => ({
    ...Comp.Base.DefaultStatePropsMap(state, ownProps),
});

const mapDispatchToProps = (dispatch: redux.Dispatch<AppState>): ConnectedDispatch => ({
    ...Comp.Base.DefaultDispatchPropsMap(dispatch),
    removeMaskedBodyClass: () => dispatch(A.Document.removeMaskedBodyClass()),
});

interface OwnProps {
}

type ConnectedState = Comp.Base.DefaultConnectedState & {
};

type ConnectedDispatch = Comp.Base.DefaultConnectedDispatch & {
    removeMaskedBodyClass: () => void;
};

interface OwnState {
}

type CombinedProps = ConnectedState & ConnectedDispatch & OwnProps;

class MobileMenuComponent extends React.Component<CombinedProps, OwnState> {

    public constructor(props: any) {
        super(props);
        this.state = {
        };
    }

    public render() {
        const auth: any = {}; // this.props.tokenData;

        return <div className="menu" id="menu-nav">
            <div className="menu-head">
                Menu
                <a href="#" className="menu-close" onClick={(e) => { ReactHelper.emptyClick(e); this.props.removeMaskedBodyClass(); }}>
                    <Icon c="l" icon="times" />
                </a>
            </div>

            <ul className="menu-list">
                {/* <li>
                    <routes.Link route={routes.Topics}>
                        <a onClick={() => this.props.removeMaskedBodyClass()}>Topics</a>
                    </routes.Link>
                </li> */}
            </ul>

            {auth.hasUserRecord
                ? <>
                    <div className="menu-section">
                        Welcome,{" "}
                        <routes.Link route={routes.Home}>
                            <a onClick={() => this.props.removeMaskedBodyClass()}>{auth.userFullName}</a>
                        </routes.Link>
                    </div>
                    <div className="menu-section">
                        <Link href={Paths.Logout}>
                            <a onClick={() => this.props.removeMaskedBodyClass()}>Sign out</a>
                        </Link>
                    </div>
                </>
                : <div className="menu-section">
                    <a href={Paths.Login} onClick={(e) => { this.props.removeMaskedBodyClass(); this.onSignInClick(e); }}>Sign in</a>
                </div>}

            <div className="menu-section">
                <a href="https://www.miteksystems.com">Mitek Systems, Inc.</a>
            </div>
        </div>;
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

export const MobileMenu: React.ComponentClass<OwnProps> = connect(mapStateToProps, mapDispatchToProps)(MobileMenuComponent);
