import { LoadingIcon } from ".";
import * as React from "react";

interface OwnProps {
    message?: JSX.Element | string;
    show: boolean;
}

export const OverlayWrapper: React.SFC<OwnProps> = (props) => {
    let message = props.message || <><LoadingIcon /> Loading&hellip;</>;

    if (typeof message !== "string") {
        message = <div className="overlay-content">{message}</div>;
    }

    const messageEl = props.show
        ? <div className="overlay">
            {((typeof message === "string")
                ? <p className="overlay-content" dangerouslySetInnerHTML={{ __html: message }} />
                : message)}
            </div>
        : null;

    return <div className="overlay-wrapper">
        {messageEl}
        {props.children}
    </div>;
};
