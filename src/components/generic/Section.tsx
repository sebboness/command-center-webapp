import * as React from "react";

interface OwnProps {
    primaryContent?: JSX.Element;
    title: string;
}

interface OwnState {
}

export class Section extends React.Component<OwnProps, OwnState> {
    public render() {
        return <div className="section">
            <div className="section-primary">
                <h2>{this.props.title}</h2>
                {this.props.primaryContent}
            </div>

            <div className="section-secondary">
                {this.props.children}
            </div>
        </div>;
    }
}

export class SectionLinks extends React.Component {
    public render() {
        let children = this.props.children;
        if (this.props.children instanceof Array)
            children = this.props.children.map((c, i) => (<li key={i}>{c}</li>));

        return <ul className="flat">{children}</ul>;
    }
}
