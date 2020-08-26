/**
 * Credit: https://gist.github.com/ClementParis016/ab06847c41160c22f278e4cabe4a0879
 */

tinymce.PluginManager.add("charactercount", function(editor) {
    var self = this;

    function update() {
        var count = self.getCount();
        editor.theme.panel.find("#charactercount").text(["{0} character{1}", count, count === 1 ? "" : "s"]);
    }

    editor.on("init", function() {
        var statusbar = editor.theme.panel && editor.theme.panel.find("#statusbar")[0];

        if (statusbar) {
            var count = self.getCount();
            window.setTimeout(function() {
                statusbar.insert({
                    classes: "charactercount",
                    disabled: editor.settings.readonly,
                    name: "charactercount",
                    text: ["{0} character{1}", count, count === 1 ? "" : "s"],
                    type: "label",
                }, 0);

                editor.on("setcontent beforeaddundo keyup", update);
            }, 0);
        }
    });

    self.getCount = function() {
        var tx = editor.getContent({ format: "raw" }).replace(/\n/g, "");
        var decoded = decodeHtml(tx);
        var decodedStripped = decoded.replace(/(<([^>]+)>)/ig, "");
        var tc = decodedStripped.length;
        return tc;
    };

    function decodeHtml(html) {
        var txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    }
});
