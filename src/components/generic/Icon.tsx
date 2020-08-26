import * as React from "react";

interface OwnProps {
    /** Determines the font awesome category, defaults to "fas" */
    c?: string;
    icon: string;
}

interface OwnState {
}

export class Icon extends React.Component<OwnProps, OwnState> {
    public render() {
        const c = "fa" + (this.props.c || "r");
        return <i className={c + " fa-" + this.props.icon}></i>;
    }
}

export const LoadingIcon: React.SFC<{}> = (props) => {
    return <Icon icon="spinner-third fa-spin" />;
};
