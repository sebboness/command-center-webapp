export interface SlugId {
    id: number;
    slug: string;
    title: string;
    valid: boolean;
}

export const ParseSlug = (id?: string) => {
    const slugId: SlugId = {
        id: 0,
        slug: id || "",
        title: "",
        valid: false,
    };

    if (!id)
        id = "";

    const matches = id.match(/\-\d+$/);
    if (matches && matches.length) {
        try {
            slugId.id = parseInt(matches[0].replace("-", ""), 10);

            if (slugId.id <= 0)
                throw new Error("Slug does not contain a valid ID");

            slugId.title = id.substr(0, id.length - matches[0].length);
            slugId.valid = true;
        }
        catch (err) { }
    }

    return slugId;
};
