import Head from "next/head";
import * as React from "react";
import { Helmet } from "react-helmet";
import Settings from "../../settings";
import { Utility } from "../../utils";

const isServer = Utility.isServer();

interface OwnProps {
    title?: string;
}

export const DocumentHead: React.SFC<OwnProps> = (props) => {
    const title = props.title === Settings.ClientName ? "" : props.title;
    const titleTag = <title>{title ? `${title} - ${Settings.ClientName}` : Settings.ClientName}</title>;

    return <>
        <Head>
            {titleTag}
            <meta httpEquiv="Content-Type" content="text/html; charset=iso-8859-1" />
            <meta name="author" content={Settings.ClientName} />
            <meta name="Copyright" content={`Copyright (c) ${Settings.ClientName}`} />
            <meta name="HandheldFriendly" content="true" />
            <meta name="viewport" content="initial-scale=1.0, user-scalable=yes, width=device-width" />
            <meta name="apple-mobile-web-app-title" content={Settings.ClientName} />

            <link rel="Shortcut Icon" href="/content/images/favicon.ico" type="image/x-icon" />
            <link href="/content/images/apple-touch-icon.png" rel="apple-touch-icon" />
        </Head>

        {isServer
            ? null
            : <Helmet>
                {titleTag}
            </Helmet>}
    </>;
};
