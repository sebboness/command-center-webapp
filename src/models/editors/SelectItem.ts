export interface SelectItem {
    disabled?: boolean;
    id: string | number | null | undefined;
    render: JSX.Element | string;
    selected?: boolean;
}
