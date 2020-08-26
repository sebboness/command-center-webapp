import _ from "lodash";
import { TypeDefinition } from "../models/generic";

export class Statuses {
    public static Inactive: TypeDefinition = { id: 0, name: "Inactive" };
    public static Active: TypeDefinition = { id: 1, name: "Active" };
    public static Deleted: TypeDefinition = { id: -1, name: "Deleted" };
    public static Created: TypeDefinition = { id: -2, name: "Created" };

    public static Values: TypeDefinition[] = [
        Statuses.Inactive,
        Statuses.Active,
        Statuses.Deleted,
        Statuses.Created,
    ];

    public static nameOf = (statusId: number | { statusId: number }) => {
        const s = typeof statusId === "number" ? statusId : statusId.statusId;
        const idx = _.findIndex(Statuses.Values, (v) => v.id === s);
        return idx > -1
            ? Statuses.Values[idx].name
            : "";
    }

    public static isActive = (statusId: number) => {
        return statusId === Statuses.Active.id;
    }

    public static isDraft = (statusId: number) => {
        return statusId === Statuses.Created.id;
    }
}