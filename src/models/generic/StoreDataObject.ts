export interface StoreDataObject<T> {
    data: T;
    loadedOn: number;
    loading: boolean;
}

export const DefaultStoreDataObject = <T>(data: T): StoreDataObject<T> => {
    return {
        data,
        loadedOn: 0,
        loading: false,
    };
};
