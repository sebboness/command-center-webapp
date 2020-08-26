import * as LZString from "lz-string";
import Settings from "../settings";

export class LocalStorage {

    /**
     * Returns the local storage object for [key] and casts it to <T>
     * @param key Name of the local storage key
     * @returns {T | undefined}
     */
    public static getItem<T>(key: string, decompress?: boolean): T | undefined {
        if (!this.hasLocalStorage())
            return undefined;

        let data = localStorage.getItem(this.getKey(key));
        if (data === null)
            return undefined;

        if (decompress)
            data = LZString.decompressFromUTF16(data);

        try {
            const obj = JSON.parse(data);
            return obj as T;
        }
        catch (err) {
            console.error(`Local storage data of key ${this.getKey(key)} is not of type ${typeof ({} as T)}. Data = "${data}"`);
            return undefined;
        }
    }

    /**
     * Removes an item from local storage
     * @param key Name of the local storage key
     */
    public static removeItem<T>(key: string) {
        if (!this.hasLocalStorage())
            return;

        localStorage.removeItem(this.getKey(key));
    }

    /**
     * Stores an item in local storage in JSON format
     * @param item Object to be stored in local storage
     * @param key Name of the local storage key
     */
    public static setItem<T>(key: string, item: T, compress?: boolean) {
        if (!this.hasLocalStorage())
            return;

        let data = JSON.stringify(item);

        if (compress)
            data = LZString.compressToUTF16(data);

        try {
            localStorage.setItem(this.getKey(key), data);
        }
        catch (err) {
            console.warn("LocalStorage setItem error:", err);
        }
    }

    /**
     * Checks if local storage is available for client
     * @returns {boolean}
     */
    public static hasLocalStorage() {
        if (typeof this._hasLS !== "undefined")
            return this._hasLS as boolean;

        // check if browser has local storage
        this._hasLS = typeof(Storage) !== "undefined";

        if (!this._hasLS)
            return false;

        try {
            const key = "localstoragehelper-test";
            localStorage.setItem(key, "1");
            this._hasLS = localStorage.getItem(key) === "1";
            localStorage.removeItem(key);
            this._hasLS = true;
            return true;
        }
        catch (error) {
            this._hasLS = false;
            return false;
        }
    }

    /** Wether or not local storage is available for client */
    private static _hasLS?: boolean;

    /**
     * Returns the full local storage key name
     * @param key The local storage key (without prefix)
     */
    private static getKey(key: string) {
        return `${Settings.LocalStorageKeyPrefix}${key}`;
    }
}
