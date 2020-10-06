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
        return <Comp.Layout.Layout isLanding title="Command Center">
            <div id="landing-logo">
                <a href="#">
                    <img src="/content/images/logo.svg" />
                </a>
            </div>
            
            <div className="cards-wrapper">
                <div className="card-container" id="mds">
                    <a href="/content/templates/mds-manager.html">
                        <div>
                            <img className="card-bg-image" src="/content/images/icon-mds.svg" />
                            {/* <p><i className="far fa-cog"></i></p> */}
                        </div>
                        <h2>MDS Manager</h2>
                        <p>
                            Manage datasets, source new images, etc.
                        </p>
                    </a>
                </div>
                
                <div className="card-container" id="core-data">
                    <a href="#">
                        <div>
                            <img className="card-bg-image" src="/content/images/icon-validate.svg" />
                            {/* <p><i className="far fa-cog"></i></p> */}
                        </div>
                        <h2>Core Data Validator</h2>
                        <p>
                            Validate your local CoreData repo
                        </p>
                    </a>
                </div>
                
                <div className="card-container" id="git">
                    <a href="#">
                        <div>
                            <img className="card-bg-image" src="/content/images/icon-git.png" />
                            {/* <p><i className="far fa-cog"></i></p> */}
                        </div>
                        <h2>Git branch management</h2>
                        <p>
                            Create and merge braches, create PRs, etc.
                        </p>
                    </a>
                </div>
                
                <div className="card-container" id="settings">
                    <a href="#">
                        <div>
                            <img className="card-bg-image" src="/content/images/icon-settings.svg" />
                            {/* <p><i className="far fa-cog"></i></p> */}
                        </div>
                        <h2>Settings</h2>
                        <p>
                            Setup CoreData, IMS credentials, etc.
                        </p>
                    </a>
                </div>
            </div>  
            
            {/* <div>
                <a href="#" className="button-cta"><p>More tools</p> <img src="/content/images/icon-arrow-down.svg" /></a>
            </div> */}
            
            <div className="search-field-landing">
                <img className="search-field-icon" src="/content/images/icon-search.svg" />
                <input className="search-field-input" type="text" placeholder="Search MDS IDs, settings, etc..." />
            </div>
        </Comp.Layout.Layout>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
