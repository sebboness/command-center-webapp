import { List } from "immutable";
import * as React from "react";

export const recursiveMap = (children: React.ReactNode, fn: (child: React.ReactNode) => void): React.ReactNode => {
    return React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) {
            return child;
        }

        if ((child.props as any).children) {
            child = React.cloneElement(child as any, {
                children: recursiveMap((child.props as any).children, fn),
            });
        }

        return fn(child);
    });
};

export const emptyClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    return false;
};

export const ensureIsList = <T>(list: List<T> | T[]): List<T> => {
    if (Array.isArray(list))
        return List(list);
    return list;
};
