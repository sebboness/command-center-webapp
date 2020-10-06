import Document, { Head, Main, NextDocumentContext, NextScript } from "next/document";
import React from "react";
import * as P from "../paths";

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
            </body>
            </html>;
    }
}

export default MyDocument;
