import { ReactSelectValue, ReactSelectOption, ElementAnchorPositionType, ElementPosition, Point } from "../models/generic";

export const formatFileSize = (n: string | number | undefined | null, decimals: number = 0, upperCase: boolean = false): string => {
    if (n === undefined || n === null)
        return "";

    n = parseFloat(n.toString());
    decimals = decimals === undefined ? 0 : decimals;
    upperCase = upperCase === undefined ? false : upperCase;

    if (isNaN(n))
        return n.toString();

    let d = n + "kb";
    const kb = 1024;
    const mb = kb * 1024;
    const gb = mb * 1024;
    const tb = gb * 1024;

    if (n < kb)
        d = formatThousands(n.toFixed(decimals)) + " b";
    else if (n >= kb && n < mb) // 1kb < n < 1mb
        d = formatThousands((n / kb).toFixed(decimals)) + " kb";
    else if (n >= mb && n < gb) // 1mb < n < 1gb
        d = formatThousands((n / mb).toFixed(decimals)) + " mb";
    else if (n >= gb && n < tb) // 1bb < n < 1tb
        d = formatThousands((n / gb).toFixed(decimals)) + " gb";
    else
        d = formatThousands((n / tb).toFixed(decimals)) + " tb";

    return upperCase
        ? d.toUpperCase()
        : d;
}

export const formatThousands = (n: string | number | undefined | null, separator: string = ",", decChar: string = "."): string => {
    let f = "";

    if (n === undefined || n === null)
        return "";

    // some countries have different formatting
    // US formatting: x,xxx,xxx.yy
    // DE formatting: x.xxx.xxx,yy
    decChar = decChar === undefined ? "." : decChar;
    let dec = "";

    let s = n.toString();
    const sep = separator === undefined ? "," : separator;

    if (s.lastIndexOf(decChar) > -1) {
        dec = s.substring(s.lastIndexOf(decChar));
        s = s.substring(0, s.lastIndexOf(decChar));
    }

    s = s.split("").reverse().join("");

    if (n < 1000)
        f = s;
    else if (n >= 1000 && n < 1000000)
        f = s.substring(0, 3) + sep + s.substring(3);
    else if (n >= 1000000 && n < 1000000000)
        f = s.substring(0, 3) + sep + s.substring(3, 6) + sep + s.substring(6);
    else if (n >= 1000000000 && n < 1000000000000)
        f = s.substring(0, 3) + sep + s.substring(3, 6) + sep + s.substring(6, 9) + sep + s.substring(9);
    else
        f = s.substring(0, 3) + sep + s.substring(3, 6) + sep + s.substring(6, 9) + sep + s.substring(9, 12) + sep + s.substring(12);

    return f.split("").reverse().join("") + dec;
}

export const getElementAnchorPosition = (el: HTMLElement, positionType: ElementAnchorPositionType): ElementPosition => {
    const anchor: ElementPosition = { top: 0, left: 0 };
    if (el === null || el === undefined)
        return anchor;

    const rect = el.getBoundingClientRect();
    const pos = getElementPosition(el);

    switch (positionType) {
        case "top-left":
        case "left-top":
            anchor.top = pos.top;
            anchor.left = pos.left;
            break;
        case "top":
            anchor.top = pos.top;
            anchor.left = pos.left + (rect.width / 2);
            break;
        case "top-right":
        case "right-top":
            anchor.top = pos.top;
            anchor.left = pos.left + rect.width;
            break;
        case "right":
            anchor.top = pos.top + (rect.height / 2);
            anchor.left = pos.left + rect.width;
            break;
        case "right-bottom":
        case "bottom-right":
            anchor.top = pos.top + rect.height;
            anchor.left = pos.left + rect.width;
            break;
        case "bottom":
            anchor.top = pos.top + rect.height;
            anchor.left = pos.left + (rect.width / 2);
            break;
        case "bottom-left":
        case "left-bottom":
            anchor.top = pos.top + rect.height;
            anchor.left = pos.left;
            break;
        case "left":
            anchor.top = pos.top + (rect.height / 2);
            anchor.left = pos.left;
            break;
    }

    return anchor;
}

export const getElementPosition = (el: HTMLElement | Element, relativeToDoc: boolean = true): ElementPosition => {
    const pos = el.getBoundingClientRect();

    if (!relativeToDoc)
        return { top: pos.top, left: pos.left };

    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: pos.top + scrollTop, left: pos.left + scrollLeft };
}

export const getScrollPosition = (): Point => {
    const supportPageOffset = window.pageXOffset !== undefined;
    const isCSS1Compat = ((document.compatMode || "") === "CSS1Compat");
    const scroll: Point = {
        x: supportPageOffset
            ? window.pageXOffset
            : (isCSS1Compat ? document.documentElement.scrollLeft : document.body.scrollLeft),
        y: supportPageOffset
            ? window.pageYOffset
            : (isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop),
    };

    return scroll;
};

export const guid = () => {
    const s4 = () => ((((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1));
    return (s4() + s4() + "-" + s4() + "-4" + s4().substr(0, 3) + "-" + s4() + "-" + s4() + s4() + s4()).toLowerCase();
};

export const isServer = () => {
    return typeof window === "undefined";
};

export const lazyLoadResource = (url: string, async?: boolean): Promise<{script: string, loaded: boolean, status: string}> => {
    // based on https://friendlybit.com/js/lazy-loading-asyncronous-javascript/
    // and https://stackoverflow.com/a/42766146/1235875
    return new Promise((resolve, reject) => {
        const scripts = document.getElementsByTagName("script");
        for (let i = scripts.length; i--;) {
            if (scripts[i].src.match(url))
                resolve({script: url, loaded: true, status: "Loaded"});
        }

        const script = document.createElement("script");
        script.type = "text/javascript";
        script.async = async === undefined ? true : async;
        script.src = url;

        if ((script as any).readyState) { // IE
            (script as any).onreadystatechange = () => {
                if ((script as any).readyState === "loaded" || (script as any).readyState === "complete") {
                    (script as any).onreadystatechange = null;
                    resolve({script: url, loaded: true, status: "Loaded"});
                }
            };
        } else { // Others
            script.onload = () => {
                resolve({script: url, loaded: true, status: "Loaded"});
            };
        }

        script.onerror = (error: any) => reject(error);

        const x = document.getElementsByTagName("script")[0];
        if (x.parentNode)
            x.parentNode.insertBefore(script, x);
    });
}

export const toHtmlIdString = (str?: string) => {
    if (!str)
        return str;
    return str.replace(/((?!([a-zA-Z\d\_\-])).)/g, "_");
};

export const toReactSelectOption = <T>(obj: T, label: string, value: ReactSelectValue): T & ReactSelectOption => {
    return {
        ...obj,
        label,
        value,
    }
};
