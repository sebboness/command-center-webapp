import Router from "next/router";

export interface UrlQuery { [key: string]: any; }

const getUrlObject = (query: UrlQuery, overwrite: boolean = false) => {
    const currentQuery: UrlQuery = !!overwrite
        ? query
        : Object.assign(Router.query || {}, query);

    Object.keys(currentQuery).map((k) => {
        const v = currentQuery[k];
        if (!v)
            delete currentQuery[k];
    });

    return { ...Router.router, query: currentQuery };
};

/**
 * Replaces the url query parameters from current location
 * @param query Flat query parameters object
 * @param [overwrite] Whether or not to overwrite the current query params. Defaults to false
 */
export const replaceQueryParams = (query: UrlQuery, overwrite: boolean = false): Promise<boolean> => {
    const urlObj = getUrlObject(query, overwrite);
    return Router.replace(urlObj);
};

/**
 * Pushes the url query parameters into history
 * @param query Flat query parameters object
 * @param [overwrite] Whether or not to overwrite the current query params. Defaults to false
 */
export const pushQueryParams = (query: UrlQuery, overwrite: boolean = false): Promise<boolean> => {
    const urlObj = getUrlObject(query, overwrite);
    return Router.push(urlObj);
};
