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
    title?: string | JSX.Element;
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
        return <div id="header">
            <div className="container-fluid">
                <section className="row">
                    <div className="col-md-8">
                        
                        {this.props.title
                            ? (typeof this.props.title === "string"
                                ? <h1 dangerouslySetInnerHTML={{ __html: this.props.title }} />
                                : <h1>{this.props.title}</h1>)
                            : null}
                    </div>
                    <div className="col-md-4">
                        <div className="btn-toolbar float-right" role="toolbar" aria-label="Actions">        
                            <div className="btn-group" role="group" aria-label="">
                                <button id="accountDropdown" type="button" className="btn btn-outline-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    Sebastian Stefaniuk
                                </button>
                                <div className="dropdown-menu" aria-labelledby="accountDropdown">
                                    <a className="dropdown-item" href="#">Logout</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>;
    }
}

export const Header: React.ComponentClass<OwnProps> = connect(mapStateToProps, mapDispatchToProps)(HeaderComponent);
