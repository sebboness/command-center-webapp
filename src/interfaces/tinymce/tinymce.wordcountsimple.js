/**
 * Credit: https://gist.github.com/ClementParis016/ab06847c41160c22f278e4cabe4a0879
 */

tinymce.PluginManager.add("wordcountsimple", function(editor) {
    var self = this;
    var debounceTimer;

    function update() {
        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }

        debounceTimer = setTimeout(function() {
            var count = self.getCount();
            editor.theme.panel.find("#wordcountsimple").text(["{0} word{1}", count, count === 1 ? "" : "s"]);
        }, 275);
    }

    editor.on("init", function() {
        var statusbar = editor.theme.panel && editor.theme.panel.find("#statusbar")[0];

        if (statusbar) {
            var count = self.getCount();
            window.setTimeout(function() {
                statusbar.insert({
                    classes: "wordcount",
                    disabled: editor.settings.readonly,
                    name: "wordcountsimple",
                    text: ["{0} word{1}", count, count === 1 ? "" : "s"],
                    type: "label",
                }, 0);

                editor.on("setcontent beforeaddundo keyup", update);
            }, 0);
        }
    });

    self.getCount = function() {
        var tx = editor.getContent({ format: "text" }).replace(/\n/g, " ");
        var decoded = decodeHtml(tx);
        var matches = ((decoded || "").match(/[\S]+/gm) || []);
        var wc = matches.length;
        return wc;
    };

    function decodeHtml(html) {
        var txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    }
});
