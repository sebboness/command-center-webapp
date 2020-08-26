import Document, { Head, Main, NextDocumentContext, NextScript } from "next/document";
import React from "react";
import * as P from "../paths";
import Settings from "../settings";

interface OwnProps {
    bodyClass?: string;
}

class MyDocument extends Document<OwnProps> {
    public static async getInitialProps(ctx: NextDocumentContext) {
        const initialProps = await Document.getInitialProps(ctx);
        let bodyClass = "";

        switch (ctx.pathname) {
            case P.Login:
                bodyClass = "signin";
                break;
        }

        return {
            ...initialProps,
            bodyClass,
        };
    }

    public render() {
        return <html>
            <Head></Head>
            <body className={this.props.bodyClass}>
                <Main />
                <NextScript />

                {Settings.GATrack
                    ? <>
                        <script async src="https://www.googletagmanager.com/gtag/js?id=UA-28231232-8" />
                        <script dangerouslySetInnerHTML={this.setGoogleTags()} />
                    </>
                    : null}
            </body>
            </html>;
    }

    private setGoogleTags() {
        return {
        __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'UA-28231232-8');
            `,
        };
    }
}

export default MyDocument;
