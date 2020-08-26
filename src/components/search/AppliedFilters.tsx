import React from "react";
import { AppliedFilter } from "../../models/search";

interface OwnProps {
    filters: AppliedFilter[];
    onClearAll?: () => void;
    onClearFilter?: (id: string | number, type: string) => void;
}

interface OwnState {
}

export class AppliedFilters extends React.Component<OwnProps, OwnState> {

    public constructor(props: any) {
        super(props);
    }

    public onClearAll(e: React.MouseEvent<HTMLAnchorElement>) {
        if (this.props.onClearAll)
            this.props.onClearAll();

        e.preventDefault();
        return false;
    }

    public onClearFilter(e: React.MouseEvent<HTMLAnchorElement>, id: string | number, type: string) {
        if (this.props.onClearFilter)
            this.props.onClearFilter(id, type);

        e.preventDefault();
        return false;
    }

    public render() {
        if (!this.props.filters.length)
            return null;

        const filters = this.props.filters.map((f, i) => {
            return <li key={i}>
                    <strong>{f.typeName}</strong>{f.name}
                    <a href="#" onClick={(e) => this.onClearFilter(e, f.id, f.type)}><i className="fa fa-times"></i></a>
                </li>;
        });

        return <div className="active-filters">
            <ul>{filters}</ul>
            <p><a onClick={(e) => this.onClearAll(e)} href="#">Clear filters</a></p>
        </div>;
    }
}
