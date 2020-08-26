/**
 * Credit: https://gist.github.com/ClementParis016/ab06847c41160c22f278e4cabe4a0879
 */

tinymce.PluginManager.add("wordlimit", function(editor) {
    var self = this;

    function update() {
        // var words = editor.plugins.wordcount.getCount();
        // var label = editor.theme.panel.find("#wordlimit");
        // if (label)
        //     label.text(["{0} word{1}", words, words === 1 ? "" : "s"]);
    }

    editor.on("init", function() {
        var min = parseInt(editor.settings.wordlimit_min, 10);
        var max = parseInt(editor.settings.wordlimit_max, 10);
        var statusbar = editor.theme.panel && editor.theme.panel.find("#statusbar")[0];

        if (statusbar && (!isNaN(min) || !isNaN(max))) {
            var words = editor.plugins.wordcountsimple.getCount();
            var minMaxDisplay = [];
            if (!isNaN(min)) {
                minMaxDisplay.push(min + " minimum");
            }
            if (!isNaN(max)) {
                minMaxDisplay.push(max + " maximum");
            }

            window.setTimeout(function() {
                statusbar.insert({
                    classes: "wordcount wordlimit",
                    disabled: editor.settings.readonly,
                    name: "wordlimit",
                    text: ["{0}", minMaxDisplay.join(" — ")],
                    type: "label",
                }, 1);

                editor.on("setcontent beforeaddundo keyup", update);
            }, 0);
        }
    });

    function decodeHtml(html) {
        var txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    }
});
