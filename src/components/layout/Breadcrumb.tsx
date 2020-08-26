import * as React from "react";

interface OwnProps {
    links: JSX.Element | JSX.Element[];
}

export const Breadcrumb: React.SFC<OwnProps> = (props) => {
    const links = Array.isArray(props.links) ? props.links : [props.links];
    if (!links.length)
        return null;

    return <ol className="breadcrumbs">
            {links.map((link, i) => (
                <li key={i}>{link}</li>
            ))}
        </ol>;
};
