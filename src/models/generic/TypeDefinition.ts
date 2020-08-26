import { SelectItem } from "../editors";

export interface TypeDefinition {
    id: number;
    name: string;
    sort?: number;
}

export const typeDefinitionsAsSelectItems = (defs: TypeDefinition[]) => {
    const filters: SelectItem[] = [];
    for (const d of defs) {
        filters.push({
            id: d.id,
            render: d.name,
        });
    }
    return filters;
};

export const typeDefinitionsAsKeyValuePair = <T extends TypeDefinition>(defs: T[]) => {
    const kvp: { [index: number]: T } = {};
    for (const d of defs)
        kvp[d.id] = d;
    return kvp;
};
