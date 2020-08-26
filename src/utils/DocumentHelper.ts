export const postForm = (path: string, params: any, method: string = "POST", enctype: string = "application/x-www-form-urlencoded") => {
    const form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("action", path);
    form.setAttribute("enctype", enctype);

    Object.keys(params)
        .filter((k) => params[k] !== null && params[k] !== undefined)
        .map((k) => {
            const hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", k);
            hiddenField.setAttribute("value", params[k]);
            form.appendChild(hiddenField);
        });

    document.body.appendChild(form);
    form.submit();
};
