let attemptedToLoad = false;

export const loadTinymce = async () => {
    // if tinymce load was already attempted, don't load it again
    if (attemptedToLoad)
        return;

    attemptedToLoad = true;

    await require("jquery");
    await require("tinymce");

    const p1 = new Promise((resolve) => {
        setTimeout(() => resolve(), 15);
    });

    await p1;

    const promises = [];
    promises.push(require("./tinymce.charactercount"));
    promises.push(require("./tinymce.characterlimit"));
    promises.push(require("./tinymce.wordcountsimple"));
    promises.push(require("./tinymce.wordlimit"));
    promises.push(require("tinymce/themes/modern"));
    promises.push(require("tinymce/plugins/anchor"));
    promises.push(require("tinymce/plugins/autolink"));
    promises.push(require("tinymce/plugins/charmap"));
    promises.push(require("tinymce/plugins/code"));
    promises.push(require("tinymce/plugins/contextmenu"));
    promises.push(require("tinymce/plugins/directionality"));
    promises.push(require("tinymce/plugins/emoticons"));
    promises.push(require("tinymce/plugins/fullscreen"));
    promises.push(require("tinymce/plugins/hr"));
    promises.push(require("tinymce/plugins/insertdatetime"));
    promises.push(require("tinymce/plugins/image"));
    promises.push(require("tinymce/plugins/lists"));
    promises.push(require("tinymce/plugins/link"));
    promises.push(require("tinymce/plugins/media"));
    promises.push(require("tinymce/plugins/nonbreaking"));
    promises.push(require("tinymce/plugins/paste"));
    promises.push(require("tinymce/plugins/preview"));
    promises.push(require("tinymce/plugins/save"));
    promises.push(require("tinymce/plugins/searchreplace"));
    promises.push(require("tinymce/plugins/table"));
    promises.push(require("tinymce/plugins/visualblocks"));
    promises.push(require("tinymce/plugins/visualchars"));
    promises.push(require("tinymce/plugins/wordcount"));
    await Promise.race(promises);

    (window as any).tinymceLoaded = true;
};
