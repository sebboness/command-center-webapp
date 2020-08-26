export class Cookie {
    /**
     * Clears a cookie
     * @function set
     * @param {string} name - Name of cookie
     * @param {string} [domain] - Domain of cookie
     */
    public static clear(name: string, domain?: string) {
        Cookie.set(name, "", -1 * 1000 * 60 * 60 * 24 * 30, domain);
    }

    /**
     * Gets the value of a cookie
     * @function get
     * @param {string} name - Name of cookie
     * @returns {string}
     */
    public static get(name: string) {
        if (Cookie.docAvailable() && document.cookie.length > 0) {
            let cStart = document.cookie.indexOf(name + "=");

            if (cStart !== -1) {
                cStart = cStart + name.length + 1;
                let cEnd = document.cookie.indexOf(";", cStart);

                if (cEnd === -1)
                    cEnd = document.cookie.length;

                // console.info(`Getting cookie "${name}"`, document.cookie.substring(cStart, cEnd));
                return decodeURI(document.cookie.substring(cStart, cEnd));
            }
        }

        // console.info(`Cookie by name "${name}" not found`);

        return null;
    }

    /**
     * Gets the value of a cookie cast to <T>
     * @param name Name of cookie
     * @returns T
     */
    public static getAs<T>(name: string): T | undefined {
        const cookieVal = Cookie.get(name);
        if (cookieVal === undefined || cookieVal === null)
            return undefined;

        try {
            return JSON.parse(decodeURIComponent(cookieVal)) as T;
        }
        catch (err) {
            return undefined;
        }
    }

    /**
     * Sets the value of a cookie
     * @function set
     * @param {string} name - Name of cookie
     * @param {object} value - Value of cookie
     * @param {number} expiresIn - Cookie expiration in milliseconds
     * @param {string} [domain] - Domain of cookie
     */
    public static set(name: string, value: any, expiresIn?: number, domain?: string) {
        let domainVal = "";
        let expires = "";

        if (expiresIn) {
            const date: any = new Date();
            date.setTime(date.getTime() + expiresIn);
            expires = "; expires=" + date["toGMTString"]();
        }

        if (domain)
            domainVal = `; domain=${domain}`;

        // console.info(`Setting cookie "${name}"`, value, expires);

        if (Cookie.docAvailable())
            document.cookie = name + "=" + value + expires + domainVal + "; path=/";
    }

    /**
     * Returns true if document is available, false otherwise (such as on server-side rendering)
     */
    public static docAvailable() {
        return typeof document !== "undefined";
    }

    /**
     * Parses a cookie string into an object
     * @param rc cookie string
     */
    public static parse(rc: string | undefined) {
        const list: { [index: string ]: string; } = {};
        if (rc) {
            rc.split(";").forEach(function( cookie ) {
                const parts = cookie.split("=");
                list[(parts.shift() || "").trim()] = decodeURI(parts.join("="));
            });
        }

        return list;
    }
}
