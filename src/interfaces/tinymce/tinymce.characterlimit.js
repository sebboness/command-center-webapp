/**
 * Credit: https://gist.github.com/ClementParis016/ab06847c41160c22f278e4cabe4a0879
 */

tinymce.PluginManager.add("characterlimit", function(editor) {
    var self = this;

    function update() {
        // var characters = editor.plugins.charactercount.getCount();
        // var label = editor.theme.panel.find("#characterlimit");
        // if (label)
        //     label.text(["{0} character{1}", characters, characters === 1 ? "" : "s"]);
    }

    editor.on("init", function() {
        var min = parseInt(editor.settings.characterlimit_min, 10);
        var max = parseInt(editor.settings.characterlimit_max, 10);
        var statusbar = editor.theme.panel && editor.theme.panel.find("#statusbar")[0];

        if (statusbar && (!isNaN(min) || !isNaN(max))) {
            var minMaxDisplay = [];
            if (!isNaN(min)) {
                minMaxDisplay.push(min + " minimum");
            }
            if (!isNaN(max)) {
                minMaxDisplay.push(max + " maximum");
            }

            window.setTimeout(function() {
                statusbar.insert({
                    classes: "characterlimit",
                    disabled: editor.settings.readonly,
                    name: "characterlimit",
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
