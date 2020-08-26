import { DocumentHead } from ".";
import * as Comp from "..";
import Link from "next/link";
import * as React from "react";
import { connect } from "react-redux";
import * as redux from "redux";
import { AppState } from "../../store";
import { SiteAlerts } from "../message";
import { Responsive } from "../responsive";

interface OwnProps {
    title?: string;
}

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

interface OwnState {
}

type CombinedProps = ConnectedState & ConnectedDispatch & OwnProps;

class SignInLayoutComponent extends React.Component<CombinedProps, OwnState> {

    public constructor(props: any) {
        super(props);
        this.state = {
        };
    }

    public componentDidMount() {
        if (typeof document !== "undefined") {
            document.body.classList.add("signin");
        }
    }

    public componentWillUnmount() {
        if (typeof document !== "undefined") {
            document.body.classList.remove("signin");
        }
    }

    public render() {
        return <>
            <Responsive />
            <DocumentHead title={this.props.title} />

            <main className="main">
                <div className="content">
                    <div id="logo">
                        <Link href="/">
                            <a className="header-logo"><img alt="Command Center" src="/content/images/logo.svg" /></a>
                        </Link>
                    </div>

                    <SiteAlerts />

                    {this.props.children}
                </div>
            </main>
        </>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignInLayoutComponent);
