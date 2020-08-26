import { Footer, Header } from ".";
import * as Comp from "..";
import * as React from "react";
import { connect } from "react-redux";
import * as redux from "redux";
import { DocumentHead } from "./DocumentHead";
import { MobileMenu } from "./MobileMenu";
import * as A from "../../actions";
import { AppState } from "../../store";
import { SiteAlerts, SiteNotifications } from "../message";
import { Responsive } from "../responsive";

const mapStateToProps = (state: AppState, ownProps: OwnProps | undefined): ConnectedState => ({
    ...Comp.Base.DefaultStatePropsMap(state, ownProps),
});

const mapDispatchToProps = (dispatch: redux.Dispatch<AppState>): ConnectedDispatch => ({
    ...Comp.Base.DefaultDispatchPropsMap(dispatch),
    removeMaskedBodyClass: () => dispatch(A.Document.removeMaskedBodyClass()),
});

type ConnectedState = Comp.Base.DefaultConnectedState & {
};

type ConnectedDispatch = Comp.Base.DefaultConnectedDispatch & {
    removeMaskedBodyClass: () => void;
};

interface OwnState {
}

interface OwnProps {
    preMainContent?: JSX.Element | JSX.Element[];
    title?: string;
}

type CombinedProps = ConnectedState & ConnectedDispatch & OwnProps;

class LayoutComponent extends React.Component<CombinedProps, OwnState> {

    public constructor(props: any) {
        super(props);
        this.state = {
        };
    }

    public componentDidUpdate() {
    }

    public render() {
        return <>
            <Responsive />
            <DocumentHead title={this.props.title} />
            <SiteNotifications />

            <div id="mask" onClick={() => this.props.removeMaskedBodyClass()}></div>

            <MobileMenu />

            <Header />

            <main className="main" data-swiftype-index="true">
                {this.props.preMainContent || null}

                <div className="main-content">
                    <div className="content">
                        <SiteAlerts />

                        {this.props.children}
                    </div>
                </div>
            </main>

            <Footer />
        </>;
    }
}

export const Layout = connect(mapStateToProps, mapDispatchToProps)(LayoutComponent);
