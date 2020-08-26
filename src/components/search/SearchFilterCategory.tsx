import * as _ from "lodash";
import * as React from "react";
import { Collapse } from "reactstrap";
import { SearchFilter } from "../../models/search";
import { Many } from "lodash";

interface OwnProps {
    defaultSort?: "count" | "name" | "id";
    excludeZeros?: boolean;
    filters: SearchFilter[];
    hideIfEmpty?: boolean;
    onChange?: (id: number, checked: boolean) => void;
    showAll?: boolean;
    showMax?: number;
    title: string;
}

interface OwnState {
    expanded: boolean;
    showingAll: boolean;
}

export class SearchFilterCategory extends React.Component<OwnProps, OwnState> {

    private showMaxDefault = 5;

    public constructor(props: any) {
        super(props);
        this.state = {
            expanded: false,
            showingAll: false,
        };

        this.onAnimateComplete = this.onAnimateComplete.bind(this);
        this.onFilterChange = this.onFilterChange.bind(this);
        this.onMoreClick = this.onMoreClick.bind(this);
    }

    public onMoreClick(e: React.MouseEvent<HTMLAnchorElement>) {
        this.setState({
            ...this.state,
            expanded: !this.state.expanded,
        });

        e.preventDefault();
        return false;
    }

    public onAnimateComplete() {
        this.setState({
            ...this.state,
            showingAll: !this.state.showingAll,
        });
    }

    public onFilterChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (this.props.onChange)
            this.props.onChange(parseInt(e.target.value, 10), e.target.checked);
    }

    public render() {
        const hideIfEmpty = this.props.hideIfEmpty ? this.props.hideIfEmpty : true;
        const excludeZeros = this.props.excludeZeros ? this.props.excludeZeros : false;
        const showMax = this.props.showMax ? this.props.showMax : this.showMaxDefault;
        const showAll = this.props.showAll ? this.props.showAll : false;

        let filtersArray = this.props.filters;
        if (excludeZeros)
            filtersArray = filtersArray.filter((f) => f.count > 0);

        if (!filtersArray.length && hideIfEmpty)
                return null;

        // setup sorting of filters
        const sort = this.props.defaultSort || "count";
        let sortFields: string[] = [];
        let sortOrders: Many<boolean|"asc"|"desc"> = [];

        switch (sort) {
            case "count":
                sortFields = ["count", "name"];
                sortOrders = ["desc", "asc"];
                break;
            case "id":
                sortFields = ["id"];
                sortOrders = ["asc"];
                break;
            case "name":
            default:
                sortFields = ["name"];
                sortOrders = ["asc"];
                break;
        }

        const sortedFilters = _.orderBy(filtersArray, sortFields, sortOrders);

        const initialFilters: JSX.Element[] = [];
        const remainingFilters: JSX.Element[] = [];

        sortedFilters.map((f, i) => {
            const checked = f.checked ? f.checked : false;
            const countEl = f.count <= 0
                ? null
                : <span className="mute"> ({f.count})</span>;
            const li = <li key={f.id}><label><input type="checkbox" checked={checked} value={f.id} onChange={this.onFilterChange} /> {f.name}{countEl}</label></li>;

            if (!showAll && i >= showMax)
                remainingFilters.push(li);
            else
                initialFilters.push(li);
        });

        const moreBtnText = this.state.showingAll ? "Less" : "More";
        const moreBtnIcon = this.state.showingAll ? "minus" : "plus";
        const moreBtn = filtersArray.length > showMax && !showAll
            ? <p className="filter-more"><a href="#" onClick={this.onMoreClick}><i className={"fa fa-" + moreBtnIcon}></i> {moreBtnText}</a></p>
            : null;

        return <div className="filter-type">
            <h3>{this.props.title}</h3>
            <ul className="filter-list initial-list">{initialFilters}</ul>
            <Collapse isOpen={this.state.expanded} onEntered={this.onAnimateComplete} onExited={this.onAnimateComplete}>
                <ul className="filter-list">{remainingFilters}</ul>
            </Collapse>
            {moreBtn}
        </div>;
    }
}
