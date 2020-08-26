/// <reference types="react" />


type RowFieldValue = string | number | Date | TODO;

type TODO = any;

interface Pagination extends TODO {
}

// TODO: check missings : https://react-bootstrap-table.github.io/react-bootstrap-table2/docs/pagination-props.html
interface _PaginationProps {
  /** Default is false, you will enable it only when you need to implement a customization completely. */
  custom?: boolean;
  /**Specify the current page. It's necessary when remote is enabled */
  page?: number;
  /**Total data size. It's necessary when remote is enabled */
  sizePerPage?: number;
  /** Total data size. It's necessary when remote is enabled */
  totalSize?: string;
  /**first page will be 0, default is 1 */
  pageStartIndex?: number //
  /** the pagination bar size, default is 5 */
  paginationSize?: number
  /** display pagination information */
  showTotal?: boolean
  /** A numeric array is also available: [5, 10]. the purpose of above example is custom the text. Example:
  ```
  [ {  text: '5', value: 5}, {  text: '10', value: 10}, {  text: 'All', value: products.length} ]
  ```
  */
  sizePerPageList?: { text: string, value: number }[]
  /**hide the going to first and last page button */
  withFirstAndLast?: boolean
  /** always show the next and previous page button */
  alwaysShowAllBtns?: boolean
  /** the text of first page button */
  firstPageText?: string
  /** the text of previous page button */
  prePageText?: string
  /** the text of next page button */
  nextPageText?: string
  /**the text of last page button */
  lastPageText?: string
  /** the title of next page button */
  nextPageTitle?: string
  /** the title of previous page button */
  prePageTitle?: string
  /** the title of first page button */
  firstPageTitle?: string
  /**  the title of last page button */
  lastPageTitle?: string
  /**hide the size per page dropdown */
  hideSizePerPage?: boolean
  /**hide pagination bar when only one page, default is false */
  hidePageListOnlyOnePage?: boolean
  /** 
   * Custom the page button inside the pagination list. This callback function have one argument which is an object and contain following props:

    page: Page number
    active: If this page is current page or not.
    disabled: If this page is disabled or not.
    title: Page title
    onPageChange: Call it when you need to change page
   */
  pageButtonRenderer?: (options: { page: number; active: boolean; disabled: boolean; title: string; onPageChange: () => void; }) => JSX.Element;
  /**
   * Custom the pagination list component, this callback function have one argument which is an object and contain following props:

    pages: Current page
    onPageChange: Call it when you need to change page
   */
  pageListRenderer?: (options: { pages: number; onPageChange: () => void; }) => JSX.Element;
  /** callback function when page was changing */
  onPageChange?: (page: number, sizePerPage: number) => any, //
  /**  callback function when page size was changing */
  onSizePerPageChange?: (sizePerPage: number, page: number) => number //
  /** custom the pagination total */
  paginationTotalRenderer?: (from: number, to: number, size: number) => TODO//{ ... }  // custom the pagination total
  /**
   * Custom the size per page dropdown component, this callback function have one argument which is an object and contain following props:

    options: Dropdown option.
    currSizePerPage: Current size per page.
    onSizePerPageChange: Call it when you need to change size per page.
   */
  sizePerPageRenderer?: (options: { options: Array<{ text: string; page: number; }>; currSizePerPage: number; onSizePerPageChange: () => void; }) => JSX.Element;
  /**
   * Custom the option of size per page dropdown component, this callback function have one argument which is an object and contain following props:

    text: The text of option.
    page: The size per page of option.
    onSizePerPageChange: Call it when you need to change size per page.
   */
  sizePerPageOptionRenderer?: (options: { page: number; text: string; onSizePerPageChange: () => void; }) => JSX.Element;
  /**
   * Custom the total information, this callbacok function have three arguments: from, to and size. 
   */
  paginationTotalRenderer?: (options: { from: number; to: number; size: number; }) => JSX.Element;
  /**
   * Accept a callback function and will be called when page changed. This callback function get below arguments:

    Arguments

    page
    sizePerPage
   */
  onPageChange?: (page: number, sizePerPage: number) => void;
  /**
   * Accept a callback function and will be called when size per page changed. This callback function get below arguments:

    Arguments

    page
    sizePerPage
   */
  onSizePerPageChange?: (page: number, sizePerPage: number) => void;
}

interface TableProps<fieldIds extends string = string> extends _PaginationProps {
  /** which column has unique values, ie, 'id' */
  keyField: string;
  /**Accepts a single Array object, please see columns definition for more detail. */
  columns: Column<fieldIds>[];
  /**Provides data for your table. It accepts a single Array object. */
  data: RowT<fieldIds>[];
  /**Default is false, if enable remote, you are supposed to be handle all the table change events, like: pagination, insert, filtering etc. This is a chance that you can connect to your remote server or database to manipulate your data.
   *
For flexibility reason, you can control what functionality should be handled on remote via a object return:
```
remote={ {
filter: true,
pagination: false,
sort: false,
cellEdit: false
} }
```
In above case, only column filter will be handled on remote because we enable it by giving true.
Note: when remote is enable, you are suppose to give onTableChange prop on BootstrapTable It's the only way to communicate to your remote server and update table states.
A special case for remote pagination:
```
remote={ { pagination: true, filter: false, sort: false } }
```
There is a special case for remote pagination, even you only specified the pagination need to handle as remote, react-bootstrap-table2 will handle all the table changes(filter, sort etc) as remote mode, because react-bootstrap-table2 only know the data of current page, but filtering, searching or sort need to work on overall data. */
  remote?: boolean | RemoteProps;
  /**true to indicate your bootstrap version is 4. Default version is 3. */
  bootstrap4?: boolean
  /**noDataIndication should be a callback function which return anything that will be showed in the table when data is empty. */
  noDataIndication?(): JSX.Element;
  /**Telling if table is loading or not, for example: waiting data loading, filtering etc. It's only valid when remote is enabled. When loading is true, react-bootstrap-table2 will attend to render a overlay on table via overlay prop, if overlay prop is not given, react-bootstrap-table2 will ignore the overlay rendering. */
  loading?: boolean;
  /**
overlay accept a factory function which should returning a higher order component. By default, react-bootstrap-table2-overlay can be a good option for you:
```
$ npm install react-bootstrap-table2-overlay
import overlayFactory from 'react-bootstrap-table2-overlay';
<BootstrapTable
data={ data }
columns={ columns }
loading={ true }  //only loading is true, react-bootstrap-table will render overlay
overlay={ overlayFactory() }
/>
```
Actually, react-bootstrap-table2-overlay is depends on react-loading-overlay and overlayFactory just a factory function and you can pass any props which available for react-loading-overlay:
```
overlay={ overlayFactory({ spinner: true, background: 'rgba(192,192,192,0.3)' }) }
```
   */
  overlay?: Overlay;
  /** Same as HTML caption tag, you can set it as String or a React JSX. */
  caption?: string | JSX.Element
  /**Same as bootstrap .table-striped class for adding zebra-stripes to a table. */
  striped?: boolean
  defaultSorted?: Sorted[];
  filter?: FilterProps<TODO>;
  pagination?: Pagination;
  cellEdit?: CellEdit<CellEditProps>;
  onTableChange?: onTableChange;


  selectRow?: SelectRowOptions
  expandRow?: ExpandRowOptions
}

interface PaginationProviderRenderProps {
  paginationProps: _PaginationProps;
  paginationTableProps: _PaginationProps;
}

type PaginationProviderProps = {
  pagination: Pagination;
};

type PaginationProvider = React.Component<PaginationProviderProps>;

// interface PaginationTableProps extends TODO {
// }

interface SizePerPageRenderer {
  options: TODO[];
  currSizePerPage: number;
  onSizePerPageChange: TODO;
}

interface CellEdit<Props extends CellEditProps = CellEditProps> {
  rowId: string
  dataField: string
  newValue: any
}

interface CellEditProps {
  mode?: 'string' | TODO;
  beforeSaveCell?: (oldValue: TODO, newValue: TODO, row: TODO, column: TODO) => TODO
  afterSaveCell?: (oldValue: TODO, newValue: TODO, row: TODO, column: TODO) => TODO
  onStartEdit?: (row: TODO, column: TODO, rowIndex: TODO, columnIndex: TODO) => TODO
}

type onTableChange = (type: TableChangeType, event: TableChangeNewState) => TODO;

interface TableChangeNewState {
  /**newest page */
  page?: number;
  /** newest sizePerPage */
  sizePerPage?: number;
  filters?: Filter<any>[];
  /**newest sort field */
  sortField?: string;
  /**newest sort order */
  sortOrder?: SortOrder;
  /**You can only see this prop when type is cellEdit */
  cellEdit?: CellEdit;
  /** when you enable remote sort, you may need to base on data to sort if data is filtered/searched */
  data?: RowT[]
}

type TableChangeType = 'cellEdit' | 'filter' | 'pagination' | 'sort'

type SortOrder = 'asc' | 'desc' | TODO;

interface Sorted {
  defaultField?: string;
  order?: string;
}


interface FilterOptions {
  page: number;
  sizePerPage: number;
  totalSize: string;
  sizePerPageRenderer: SizePerPageRenderer;
}

interface Filter<Type extends TODO=TODO> {
  filterVal: FilterVal;
  filterType: FilterType;
  comparator: PredefinedComparatorTypes;
}

interface FilterProps<Type extends TODO> { //TODO: is thihs the same as Filter?
  /** accept callback function and you can call it for filter programmtically */
  getFilter?(filter: FilterFunction<Type>): TODO;
  defaultValue?: Type
  placeholder?: string
  className?: string
  style?: CSSStyleDeclaration
  /** how long will trigger filtering after user typing, default is 500 ms */
  delay?: number
  /** default for text is Comparator.LIKE, default for select is Comparator.EQ */
  comparator?: PredefinedComparatorTypes
  caseSensitive?: true;
  /**custom the style on comparator select, example: { backgroundColor: 'antiquewhite' } */
  comparatorStyle?: CSSStyleDeclaration,
  /** custom the class on comparator select */
  comparatorClassName?: string
  /**dont render empty option for comparator */
  withoutEmptyComparatorOption?: boolean,
}

interface TextFilterProps extends FilterProps<TODO/* a concrete type*/> {
}

interface DateFilterProps extends FilterProps<TODO/* a concrete type*/> {
  /**custom the style on date input, example: { backgroundColor: 'cadetblue', margin: '0px' } */
  dateStyle?: CSSStyleDeclaration,
  /**custom the class on date input */
  dateClassName?: string
  defaultValue?: { date: Date, comparator: PredefinedComparatorTypes }
}

interface SelectFilterProps extends FilterProps<TODO/* a concrete type*/> {
  options?: { value: string | number, label: string }[] | string[],
  /** hide the default select option */
  withoutEmptyOption?: boolean
}

interface NumberFilterProps extends FilterProps<TODO/* a concrete type*/> {
  /**  if options defined, will render number select instead of number input */
  options?: number[]
  /**dont render empty option for numner select if it is d */
  withoutEmptyNumberOption?: boolean,
  /**Custom  comparators, example: [Comparator.EQ, Comparator.GT, Comparator.LT],  */
  comparators?: PredefinedComparatorTypes[]
  /**custom the style on number input/select, example: { backgroundColor: 'cadetblue', margin: '0px' } */
  numberStyle?: CSSStyleDeclaration
  /**custom the class on number input/select */
  numberClassName?: string,
  defaultValue?: { number: number, comparator: PredefinedComparatorTypes },
}

interface RemoteProps {
  filter?: boolean
  pagination?: boolean
  sort?: boolean
  cellEdit?: boolean
}

interface CustomFilterProps {

  type: TODO//: FILTER_TYPES.NUMBER,  // default is FILTER_TYPES.TEXT
  comparator?: PredefinedComparatorTypes//: Comparator.EQ, // only work if type is FILTER_TYPES.SELECT
  caseSensitive?: boolean//false, // default is true
}


type FilterFunction<Type extends TODO> = (val: Type) => TODO

type FilterVal = string | TODO;

type FilterType = 'TEXT' | TODO;
declare enum PredefinedComparatorTypes  {LIKE = 'LIKE', EQ='=', NE='!=', GT='>', GE='>=', LT='<', LE='<='}

type PredefinedComparators = {
  [type in PredefinedComparatorTypes]: TODO;
};



// EDITOR

interface EditorProps {
}



// OVERLAY
interface OverlayOptions {
  spinner: boolean;
  background: Color;
}



// TOOLKIT
type ToolkitOptions<FieldIds extends string> = TableProps<FieldIds> & {
  search?: boolean | SearchOptions;
};


interface SearchBarOptions {
  /** Custom the class on input element. */
  className?: string;

  /** milionsecond for debounce user input. */
  delay?: number;

  /** Custom the placeholder on input element. */
  placeholder?: string;

  /** Custom the style on input element. */
  style?: React.CSSProperties;
}


interface SearchBarProps {
  /** Clears a search */
  onClear: () => void;

  /** Triggers a search */
  onSearch: (value: string) => void;

  /** Current search text */
  searchText: string;
};


interface SearchOptions {
  /** Accept a string that will be used for default searching when first time table render. */
  defaultSearch?: string;

  /** If you want to search on the formatted data, you are supposed to enable this props.
   * react-bootstrap-table2 will check if you define the column.formatter when doing search. */
  searchFormatted?: boolean;
}


type Color = string;

type Overlay = TODO


// SELECT AND EXPAND

interface SelectRowOptions { mode: 'checkbox', clickToSelect: boolean }
interface ExpandRowOptions { renderer: (row: any) => JSX.Element, showExpandColumn?: boolean }





declare module 'react-bootstrap-table-next' {

  export default class BootstrapTable<FieldIds extends string> extends React.Component<BootstrapTableProps<FieldIds>, TODO> {
  }

  export type BootstrapTableProps<fieldIds extends string = string> = TableProps<fieldIds>;

  /**Definition of columns props on BootstrapTable
   *  TODO: check missings here: https://react-bootstrap-table.github.io/react-bootstrap-table2/docs/column-props.html
   * */
  export interface Column<FieldId extends string = string> {

    /**
    Use dataField to specify what field should be apply on this column. If your raw data is nested, for example:
```
const row = {
  id: 'A001',
  address: {
    postal: '1234-12335',
    city: 'Chicago'
  }
}
```
You can use dataField with dot(.) to describe nested object:
```
dataField: 'address.postal'
dataField: 'address.city'
```
     */
    dataField: FieldId;
    text: string;
    /**Sometime, you just want to have a column which is not perform any data but just some action components. In this situation, we suggest you to use isDummyField. If column is dummy, the column.dataField can be any string value, cause of it's meaningless. However, please keep dataField as unique as possible.
There's only one different for dummy column than normal column, which is dummy column will compare the whole row value instead of cell value when call shouldComponentUpdate. */
    isDummyField?: boolean
    /**hidden allow you to hide column when true given. */
    hidden?: boolean
    /**Enable the column sort via a true value given. */
    sort?: boolean;
    /**formatter allow you to customize the table column and only accept a callback function which take four arguments and a JSX/String are expected for return.
     *
     * Attention: Don't use any state data or any external data in formatter function, please pass them via formatExtraData. In addition, please make formatter function as pure function as possible as you can.
    */
    formatter?: (cell: TODO, row: TODO, rowIndex: number, formatExtraData: any) => JSX.Element | string
    filter?: TODO;

    headerStyle?: () => React.CSSProperties;

    //     column.headerFormatter - [Function]
    // headerFormatter allow you to customize the header column and only accept a callback function which take three arguments and a JSX/String are expected for return.
    // column: current column object itself
    // colIndex: index of current column
    // components: an object which contain all of other react element, like sort caret or filter etc.
    // The third argument: components have following specified properties:
    // {
    //   sortElement, // sort caret element, it will not be undefined when you enable sort on this column
    //   filterElement // filter element, it will not be undefined when you enable column.filter on this column
    // }

    /** only work when column.sort is enable. sortFunc allow you to define your sorting algorithm. This callback function accept six arguments:
    ```
    {
      // omit...
      sort: true,
      sortFunc: (a, b, order, dataField, rowA, rowB) => {
        if (order === 'asc') return a - b;
        else return b - a;
      }
    } ```
    */
    sortFunc?<T>(a: T, b: T, order: 'asc' | 'desc', rowA: Row, rowB: Row): number

    sortValue?<T>(cell: TODO, row: TODO): () => string | number | boolean | null | undefined

    /**
    Sometimes, if the cell/column value that you don't want to filter on them, you can define filterValue to return a actual value you wanna be filtered:
    Parameters
     * cell: The value of current cell.
     * row: The value of current row.
     * Return value
    A final String value you want to be filtered.
    ```
    {
      dataField: 'price',
      text: 'Product Price',
      filter: textFilter(),
      filterValue: (cell, row) => owners[cell]
    }
    ```
    */
    filterValue?<T>(cell: T, row: TODO): any
  }

  export type Row = RowT
}
type RowT<Type extends TODO = TODO, FieldId extends string=string> = {
  [fieldName in FieldId]: RowFieldValue;
};
declare module "react-bootstrap-table2-filter" {
  export default function filterFactory<Type extends TODO>(options?: FilterOptions): FilterProps<Type>;
  function textFilter(props?: TextFilterProps): TODO;
  function dateFilter(props?: DateFilterProps): TODO;
  function selectFilter(props?: SelectFilterProps): TODO;
  function multiSelectFilter(props?: SelectFilterProps): TODO;
  function numberFilter(props?: NumberFilterProps): TODO;
  function customFilter(props?: CustomFilterProps): TODO;
  var Comparator: PredefinedComparators;
}

declare module "react-bootstrap-table2-paginator" {
  export default function paginationFactory(options?: _PaginationProps): Pagination;
  export class PaginationProvider extends React.Component<PaginationProviderProps, TODO> {
  }

  export interface PaginationProviderRenderProps {
    paginationProps: _PaginationProps;
    paginationTableProps: _PaginationProps;
  }

  export type PaginationProps = _PaginationProps;

  export interface IPagination {
    PaginationListStandalone: React.Component<_PaginationProps, TODO>;
    PaginationTotalStandalone: React.Component<_PaginationProps, TODO>;
    SizePerPageDropdownStandalone: React.Component<_PaginationProps, TODO>;
  }

  export const Pagination: IPagination = {
    PaginationListStandalone,
    PaginationTotalStandalone,
    SizePerPageDropdownStandalone,
  }

  // export function paginationFactory(options?: _PaginationProps): Pagination;
}

declare module "react-bootstrap-table2-editor" {
  export default function editorFactory<todo extends TODO>(props?: CellEditProps): CellEdit;
}

declare module "react-bootstrap-table2-overlay" {
  export default function overlayFactory(props?: OverlayOptions): Overlay;
}

declare module "react-bootstrap-table2-toolkit" {
  export default class ToolkitProvider<FieldIds extends string> extends React.Component<ToolkitOptions<FieldIds>, TODO> {
  }

  export interface ToolkitRenderProps {
    baseProps: BootstrapTableProps<string>;
    searchProps: SearchBarProps;
  }

  export interface ISearch {
    SearchBar: React.ComponentClass<SearchBarProps & SearchBarOptions, TODO>;
    ClearSearchButton: React.ComponentClass<SearchBarProps & SearchBarOptions, TODO>;
  }

  export const Search: ISearch = {
    SearchBar,
    ClearSearchButton,
  }
}