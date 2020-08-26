/// <reference path="../../node_modules/@types/plupload/index.d.ts" />

export class PluploadOptions {
    public static Default = (): plupload_settings => ({
        browse_button: "",
        chunk_size : "5mb", // Minimum chunk size when uploading to amazon s3
        flash_swf_url: `${process.env.PUBLIC_URL}/content/plupload/Moxie.swf`,
        runtimes: "html5,html4,flash,silverlight",
        silverlight_xap_url: `${process.env.PUBLIC_URL}/content/plupload/Moxie.xap`,
        unique_names : true,
        url: "",
    })
}
