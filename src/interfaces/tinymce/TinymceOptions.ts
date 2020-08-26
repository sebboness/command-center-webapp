export class TinymceOptions {
    public static defaultAdmin: object = {
        apply_source_formatting: true,
        // forced_root_block: false, <== This forces <br /> instead of <p> tags when hitting enter key.
        add_form_submit_trigger: true,
        add_unload_trigger: false,
        branding: false,
        content_css: "/content/styles/master.css,/content/styles/tinymce.css",
        fix_list_elements: true,
        fix_nesting: true,
        fix_table_elements: true,
        remove_trailing_nbsp: true,
        height: 400,
        menubar: false,
        plugins: [
            "autolink lists link charmap preview hr anchor",
            "searchreplace wordcount visualblocks visualchars code fullscreen",
            "insertdatetime media nonbreaking save table contextmenu directionality",
            "emoticons paste image",
            // "imagemanager documentmanager",
        ],
        skin_url: `/content/skins/lightgray`,
        tab_focus: ":prev,:next",
        theme: "modern",
        toolbar1: "styleselect | copy paste | undo redo | bold italic | alignleft aligncenter alignright | bullist numlist"
                // + " | link unlink anchor | imagemanager documentmanager | media charmap hr | cleanup code spellchecker table",
                + " | link unlink anchor | image media charmap hr | cleanup code spellchecker table",
        remove_script_host: true,
        relative_urls: false,
        init_instance_callback: (ed: any) => {
            // if textarea is disabled, make sure to prevent editor from being updated:
            const editorEl = document.getElementById(ed.id) as HTMLTextAreaElement;
            if (editorEl && editorEl.disabled === true) {
                ed.getBody().setAttribute("contenteditable", false);
            }
        },
        style_formats: [
            { title: "Header 1", format: "h1" },
            { title: "Header 2", format: "h2" },
            { title: "Header 3", format: "h3" },
            { title: "Header 4", format: "h4" },
            { title: "Header 5", format: "h5" },
            { title: "Header 6", format: "h6" },
            { title: "Paragraph", format: "p" },
            { title: "Blockquote", block: "blockquote", wrapper: true },
            { title: "Button", inline: "span", classes: "action" },
            { title: "Small grey text", block: "p", classes: "mute" },
        ],
        // http://wiki.moxiecode.com/index.php/TinyMCE:Configuration/valid_child_elements
        valid_child_elements: "a[%istrict_na|#text],"
        + "abbr/acronym/caption/cite/code/del/dfn/em/h2/h3/h4/h5/h6/ins/kbd/pre/strong/sub/sup/th[%btrans|%istrict|#text],"
        + "blockquote[%bstrict],"
        + "dl[dd|dt],dd/div/dt/li/td[%btrans|%istrict|#text],"
        + "object[embed|param],ol/ul[li],"
        + "iframe[src|frameborder|style|scrolling|class|width|height|name|align],"
        + "p[%btrans|%istrict|#text],"
        + "table[caption|tbody|td|tfoot|thead|tr],tbody/tfoot/thead[tr],tr[td|th]",
        // http://wiki.moxiecode.com/index.php/TinyMCE:Configuration/valid_elements
        valid_elements: "-a[class|href|id|title|alt|target],-abbr[title],-acronym[title],"
        + "-blockquote[style],br,"
        + "-caption,-cite,-code,"
        + "-del,-dfn[title],div[class|id|style],dl,dd,dt,"
        + "-em/i,embed[*],"
        + "-h1[id|style],-h2[id|style],-h3[id|style],-h4[id|style],-h5[id|style],-h6[id|style],"
        + "hr[class|width|size|noshade],"
        + "iframe[*],"
        + "img[*],-ins," // img requires * to enable media plugin
        + "-kbd,"
        + "-li,"
        + "object[*],-ol,"
        + "-p[class|id|style],param[*],-pre,"
        + "span[id|class],-strong/b,-sub,-sup,"
        + "-table[*],-tbody,#td[*],-tfoot,#th[*],-thead,-tr[*],"
        + "-ul[class]",
        visual_table_class: "mceTable",
        width: "100%",

        plugin_imagemanager_opts: {
            allowReinitialize: true,
            bg: false, prefetch: true,
            datasource_type: "tinymce",
            folder: "/content/images/cms/",
            hide_no_files_msg: true,
            markup: { tag: "div", align_left_class: "call-l", align_right_class: "call-r" },
        },

        plugin_documentmanager_opts: {
            allowReinitialize: true,
            bg: false,
            datasource_type: "tinymce",
            folder: "/content/documents/",
            hide_no_files_msg: true,
            upload_document_exts: "doc|docx|dot|eps|pdf|ppt|pptx|pot|tif|tiff|xls|xlsx",
            response: { ext: "doc|docx|dot|eps|pdf|ppt|pptx|pot|tif|tiff|xls|xlsx" },
        },
    };

    public static defaultPublic(options?: object, plugins?: string) {
        const config: any = {
            ...TinymceOptions.defaultAdmin,
            add_form_submit_trigger: true,
            height: 250,
            plugins: [
                "autolink lists link charmap preview hr anchor",
                "searchreplace wordcount visualblocks visualchars code fullscreen",
                "insertdatetime media nonbreaking save table contextmenu directionality",
                "emoticons paste",
            ],
            toolbar1: "styleselect | copy paste | undo redo | bold italic | alignleft aligncenter alignright | bullist numlist | link unlink anchor | charmap cleanup code",
            style_formats: [
                { title: "Header 3", format: "h3" },
                { title: "Header 4", format: "h4" },
                { title: "Header 5", format: "h5" },
                { title: "Header 6", format: "h6" },
                { title: "Paragraph", format: "p" },
                { title: "Blockquote", block: "blockquote", wrapper: true },
                { title: "Button", inline: "span", classes: "action" },
                { title: "Small grey text", block: "p", classes: "mute" },
            ],
            ...(options || {}),
        };

        config.plugins = ["charmap code " + (plugins || "")];
        return config;
    }

    public static minimumEdit(options?: object, plugins?: string) {
        const config: any = {
            ...TinymceOptions.defaultAdmin,
            add_form_submit_trigger: true,
            height: 125,
            plugins: [
                "autolink lists link charmap preview hr anchor",
                "searchreplace wordcount visualblocks visualchars code fullscreen",
                "insertdatetime media nonbreaking save table contextmenu directionality",
                "emoticons paste",
            ],
            toolbar1: "styleselect | copy paste | undo redo | bold italic | alignleft aligncenter alignright | bullist numlist | link unlink anchor | charmap cleanup code",
            style_formats: [
                { title: "Paragraph", format: "p" },
                { title: "Blockquote", block: "blockquote", wrapper: true },
                { title: "Button", inline: "span", classes: "action" },
                { title: "Small grey text", block: "p", classes: "mute" },
            ],
            ...(options || {}),
        };

        config.plugins = plugins
            ? [config.plugins[0] + plugins]
            : config.plugins;
        return config;
    }

    public static specialCharacters(options?: object, plugins?: string) {
        const config: any = {
            ...TinymceOptions.defaultAdmin,
            cleanup: true,
            convert_newlines_to_brs: false,
            elementpath: false,
            entity_encoding: "raw",
            force_br_newlines: false,
            force_p_newlines: false,
            forced_root_block: "",
            height: 84,
            inline_styles: false,
            paste_as_text: true,
            remove_linebreaks: true,
            statusbar: false,
            toolbar1: "subscript superscript | charmap",
            valid_elements: "sub,sup",
            width: "100%",
            ...(options || {}),
        };

        config.plugins = ["charmap code paste " + (plugins || "")];
        return config;
    }
}
