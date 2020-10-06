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

class SidebarComponent extends React.Component<CombinedProps, OwnState> {

    public constructor(props: any) {
        super(props);
        this.state = {
        };
    }

    public render() {

        return <div id="sidebar-wrapper" className="content-column">
            {/* Logo */}
            <div className="logo">
                <a href="/content/templates/index.html">
                    <img src="/content/images/logo.svg" />
                </a>
            </div>
            
            {/* Menu */}
            <div className="sidebar-nav bottom" id="sidebar">
                <ul className="list-unstyled">
                    {/* <li>
                        <a href="#homeSubmenu" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle collapsed">
                            <span className="icon">
                                <i className="fal fa-id-card"></i>
                            </span>
                            MDS Manager
                        </a>
            
                        <ul className="collapse list-unstyled" id="homeSubmenu">
                            <li><a href="#">Datasets</a></li>
                            <li><a href="#">Image sourcing</a></li>
                        </ul>
                    </li> */}
                    <li className="active mds-color">
                        <a href="#">
                            <span className="icon">
                                <i className="fal fa-id-card"></i>
                            </span>
                            MDS Manager
                        </a>
                    </li>
                    <li className="core-data-color">
                        <a href="#">
                            <span className="icon">
                                <i className="fal fa-clipboard-list-check"></i>
                            </span>
                            CoreData Validator
                        </a>
                    </li>
                    <li className="git-color">
                        <a href="#">
                            <span className="icon">
                                <i className="fab fa-github"></i>
                            </span>
                            GIT Branches
                        </a>
                    </li>
                    <li className="settings-color">
                        <a href="#">
                            <span className="icon">
                                <i className="far fa-cog"></i>
                            </span>
                            Settings
                        </a>
                    </li>
                </ul>
            </div>
        </div>;
    }
}

export const Sidebar: React.ComponentClass<OwnProps> = connect(mapStateToProps, mapDispatchToProps)(SidebarComponent);
