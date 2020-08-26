import _ from "lodash";
import { RouteParams } from "next-routes";
import * as React from "react";
import * as RS from "react-select";
import { Styles } from "react-select/lib/styles";
import * as M from "../../models";
import routes from "../../routes";
import { ReactHelper, Utility } from "../../utils";

interface OwnProps {
    id: string;
    value?: string;
}

interface OwnState {
    value: string;
}

type DataResult = M.Generic.ReactSelectOption;

const selectStyles: Styles = {
    control: (styles, _state) => ({
        ...styles,
        border: "none",
        borderColor: "rgba(0,0,0,0)",
        boxShadow: "none",
    }),
    option: (styles, state: any) => {
        console.log("option state", state);
        return {
            ...styles,
            background: state.isFocused ? "#eee" : "none",
        };
    },
    valueContainer: (styles) => ({
        ...styles,
    }),
};

export class SiteSearch extends React.Component<OwnProps, OwnState> {

    private _searchTimeout: NodeJS.Timer | undefined;
    private _searchRegex: RegExp | undefined;
    private _select: RS.Async<DataResult> | null = null;
    private _selectValue = "";

    public constructor(props: OwnProps) {
        super(props);

        const value = props.value || "";

        this.state = {
            value,
        };
    }

    public render() {
        return <div className="search">
            <RS.Async
                cacheOptions
                className="search-txt"
                classNamePrefix="search"
                components={{
                    DropdownIndicator: () => null,
                    DownChevron: () => null,
                    IndicatorSeparator: () => null,
                    Option: (optProps) => {
                        const data = optProps.data as DataResult;
                        const label = data.label.replace(this._searchRegex!, "<strong>$&</strong>");
                        const className = `search-result ${optProps.isFocused ? "focused" : ""}`;
                        return <div { ...optProps.innerProps } className={className} dangerouslySetInnerHTML={{ __html: label }} />;
                    },
                }}
                defaultOptions
                instanceId={this.props.id}
                loadOptions={(search, callback) => this.searchTags(search, callback)}
                noOptionsMessage={() => null as any}
                onChange={(rs) => this.onChange(rs as DataResult)}
                onInputChange={(value) => this.setState({ ...this.state, value })}
                onBlur={() => this._selectValue = this.state.value}
                onKeyDown={(evt) => this.onKeyDown(evt)}
                placeholder="Search..."
                styles={selectStyles}
                ref={(ref) => this._select = ref as RS.Async<DataResult>}
                // inputValue={this.state.value}
            />
            <button className="search-btn" title="Go" onClick={() => this.onGoClick()}><i className="fas fa-search"></i></button>
        </div>;
    }

    private clearSelect() {
        if (this._select) {
            (this._select.select as any).state.inputValue = "";
            (this._select.select as any).state.menuIsOpen = null;
            (this._select.select as any).state.value = null;
        }
    }

    private escapeRegExp(str: string) {
        // https://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
        return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }

    private searchTags(search: string, callback: (options: any[]) => void) {
        const api: any = {};

        if (!search || search.length < 2)
            return callback([]);

        if (this._searchTimeout !== undefined)
            clearTimeout(this._searchTimeout);

        this._searchTimeout = setTimeout(async () => {
            this._searchRegex = new RegExp(`(${this.escapeRegExp(search)})`, "ig");
            const result = await api.suggests({
                q: search,
            });

            if (result.isSuccess && result.data) {
                let options = result.data.records.page.map((x: any) => Utility.toReactSelectOption(x, x.title, x.id));

                // Add search query to options if not in results
                const searchIdx = _.findIndex(options, (x: any) => x.title.toLowerCase() === search.toLowerCase());
                if (searchIdx === -1) {
                    options = [
                        {
                            title: search,
                            label: search,
                            value: search,
                        } as any,
                        ...options,
                    ];
                }

                callback(_.uniqBy(options, (x) => x.label));
            }
            else {
                console.warn(result.errors.join("; "));
                return callback([]);
            }
        }, 375);
    }

    private onChange(rs: DataResult) {
        this.setState({ ...this.state, value: rs.label }, () => {
            this._selectValue = this.state.value;
            // routes.Router.pushRoute(routes.Search, { q: rs.title });
        });
    }

    private onKeyDown(e: React.KeyboardEvent<HTMLElement>) {
        const charCode = (typeof e.which === "number") ? e.which : e.keyCode;
        if (this._select && charCode === 13) {
            // Enter
            if (!(this._select.select as any).state.menuIsOpen) {
                this._selectValue = this.state.value;
                this.clearSelect();
                this.onGoClick();
            }
        }
    }

    private onGoClick(e?: React.MouseEvent<HTMLAnchorElement>) {
        if (e)
            ReactHelper.emptyClick(e);

        let params: RouteParams | undefined;
        if (this._selectValue)
            params = { q: this._selectValue };

        // this.clearSelect();
        // routes.Router.pushRoute(routes.Search, params);
    }
}
