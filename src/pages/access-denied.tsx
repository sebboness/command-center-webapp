import Link from "next/link";
import * as React from "react";
import * as BS from "reactstrap";
import * as Comp from "../components";
import { NextContextWithStore } from "../interfaces";

interface OwnProps {
    host: string;
    url?: string;
}

interface OwnState {
    host: string;
    url?: string;
}

type CombinedProps = OwnProps;

class AccessDeniedPage extends React.Component<CombinedProps, OwnState> {

    public static async getInitialProps(ctx: NextContextWithStore) {

        const host = ctx.req
            ? (ctx.req.protocol + "://" + ctx.req.headers["host"])
            : window.location.href.substr(0, window.location.href.indexOf("/", 10));

        return {
            host,
            url: ctx.query && ctx.query.url,
        };
    }

    public constructor(props: CombinedProps) {
        super(props);
        this.state = {
            host: props.host,
            url: props.url,
        };
    }

    public render() {
        return <Comp.Layout.Layout title="Access denied">
            <BS.Alert color="warning">
                <h1>Access denied</h1>

                <p>You do not have access to the requested page.</p>

                {this.state.url
                    ? <p>Url of error: <Link href={this.state.url}><a>{this.state.host + this.state.url}</a></Link></p>
                    : null}
            </BS.Alert>
        </Comp.Layout.Layout>;
    }
}

export default AccessDeniedPage;
