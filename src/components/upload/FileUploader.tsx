import React from "react";
import { connect } from "react-redux";
import * as BS from "reactstrap";
import * as redux from "redux";
import { PluploadOptions } from "../../interfaces/PluploadOptions";
import { AppState } from "../../store";
import { ReactHelper, Utility } from "../../utils";
import { Icon } from "../generic";
import { resultToErrors, IResult, Result } from "../../models/result";
/// <reference path="../../../node_modules/@types/plupload/index.d.ts" />

declare var plupload: any;

const mapStateToProps = (state: AppState, _ownProps: FileUploaderProps | undefined): ConnectedState => ({
    accessToken: "", // state.auth.accessToken,
});

const mapDispatchToProps = (_dispatch: redux.Dispatch<AppState>): ConnectedDispatch => ({
});

export interface UploaderFile {
    completeTimestamp?: number;
    id: string;
    lastModifiedDate?: Date;
    loaded: number;
    name: string;
    origSize: number;
    percent: number;
    relativePath?: string;
    size: number;
    status: number;
    target_name: string;
    type: string;
}

export interface FileUploaderSettings {
    /** Required */
    url: string;

    /** Filters */
    filters?: plupload_filters;

    /** Control the request */
    headers?: any;
    max_retries?: number;
    multipart?: boolean;
    multipart_params?: any;

    /** Chunk */
    chunk_size?: number | string;

    /** Client-Side Image Resize */
    resize?: plupload_resize;

    /** Drag&Drop Files from the Desktop */
    drop_element?: string;

    /** Useful Options */
    multi_selection?: boolean;
    required_features?: string | any;
    unique_names?: boolean;

    /** Optional */
    runtimes?: string;
    file_data_name?: string;

    events?: {
        beforeUpload?: (up: plupload.Uploader, file: UploaderFile) => void;
        chunkUploaded?: (up: plupload.Uploader, file: UploaderFile, info: plupload_chunk_response) => void;
        error?: (up: plupload.Uploader, error: plupload_error) => void;
        filesAdded?: (up: plupload.Uploader, files: UploaderFile[]) => void;
        fileUploaded?: (up: plupload.Uploader, file: UploaderFile, info: plupload_response) => void;
        uploadComplete?: (up: plupload.Uploader, files: UploaderFile[]) => void;
        uploadProgress?: (up: plupload.Uploader, file: UploaderFile) => void;
    };
}

interface OptionalProps {
    browseLabel?: string;
    buttons?: JSX.Element | JSX.Element[];
    id?: string;
    uploadOnSelect?: boolean;
    onUploadComplete?: (upload: any) => void;
    renderBrowse?: (id: string, props: FileUploaderProps) => JSX.Element;
}

export type FileUploaderProps = OptionalProps & {
    uploader: FileUploaderSettings;
};

interface ConnectedState {
    accessToken?: string;
}

interface ConnectedDispatch {
}

interface OwnState {
    clearingFile: boolean;
    errors: string[];
    selectedFile?: UploaderFile;
    percentUploaded: number;
    pluploadOk: boolean;
    uploading: boolean;
}

type CombinedProps = ConnectedState & ConnectedDispatch & FileUploaderProps;

export class FileUploaderComponent extends React.Component<CombinedProps, OwnState> {

    public static defaultProps: OptionalProps = {
        renderBrowse: (id: string, props: FileUploaderProps) => (
            <BS.Button id={id}><Icon icon="folder" /> {props.browseLabel || "Browse"}</BS.Button>
        ),
        uploadOnSelect: true,
    };

    /** Whether or not the document variable is available */
    private _hasDoc = (typeof window !== "undefined" && typeof document !== "undefined");
    private _id: string = "";
    private _idContainer: string = "";
    private _idPicker: string = "";
    private _uploader: plupload.Uploader | undefined;
    private _mounted = false;

    public constructor(props: CombinedProps) {
        super(props);

        this._id = props.id || Utility.guid();
        this._idContainer = this._id + "-container";
        this._idPicker = this._id + "-picker";

        this.state = {
            clearingFile: false,
            errors: [],
            percentUploaded: 0,
            pluploadOk: false,
            uploading: false,
        };
    }

    public async componentDidMount() {
        this._mounted = true;

        if (!this. _hasDoc)
            return;

        // make sure we have the plupload script loaded from CDN
        if (!(window as any).plupload) {
            await Utility.lazyLoadResource("https://cdnjs.cloudflare.com/ajax/libs/plupload/2.3.6/plupload.full.min.js");
            await new Promise((resolve) => setTimeout(() => resolve(), 125)); // wait a bit for script to load into memory
        }

        if ((window as any).plupload) {
            const container = document.getElementById(this._idContainer);
            const picker = document.getElementById(this._idPicker);

            if (!container || !picker) {
                console.warn("container or picker elements are null", container, picker);
                return;
            }

            // setup uploader settings object
            const settings: plupload_settings = {
                ...PluploadOptions.Default(),
                headers: {
                    Authorization: "Bearer " + this.props.accessToken,
                },
                init: {
                    BeforeUpload: (up: plupload.Uploader, file: UploaderFile) => {
                        // make sure to include the unique file ID and chunk size for each chunk upload
                        up.settings.multipart_params = up.settings.multipart_params || {};
                        up.settings.multipart_params.fileId = file.id;
                        up.settings.multipart_params.name = file.name;
                        up.settings.multipart_params.size = file.size;
                        up.settings.multipart_params.chunkSize = up.settings.chunk_size;

                        // make sure auth headers are updated
                        up.settings.headers = up.settings.headers || {};
                        up.settings.headers["Authorization"] = "Bearer " + this.props.accessToken;

                        // if (self.MediaId() > 0)
                        //     up.settings.multipart_params.MediaId = self.MediaId();

                        if (this._mounted)

                        if (this.props.uploader.events && this.props.uploader.events.beforeUpload)
                            this.props.uploader.events.beforeUpload(up, file);
                    },

                    ChunkUploaded: (up: plupload.Uploader, file: UploaderFile, response: plupload_chunk_response) => {
                        // make sure auth headers are updated
                        up.settings.headers = up.settings.headers || {};
                        up.settings.headers["Authorization"] = "Bearer " + this.props.accessToken;

                        const result = this.responseToResult(response);
                        if (!result.isSuccess) {
                            console.error("ChunkUploaded", response);
                            // if result is not successful, stop the upload.
                            if (this._mounted)
                                this.setErrors(resultToErrors(result));
                            up.stop();
                        }
                        else
                            up.settings.multipart_params.guid = result.data ? result.data.guid : undefined;

                        if (this.props.uploader.events && this.props.uploader.events.chunkUploaded)
                            this.props.uploader.events.chunkUploaded(up, file, response);
                    },

                    Error: (up: plupload.Uploader, error: plupload_error) => {
                        console.error("FileUploader error", up, error);
                        const result = this.responseToResult(error);
                        if (this._mounted)
                            this.setErrors(resultToErrors(result));

                        if (this.props.uploader.events && this.props.uploader.events.error)
                            this.props.uploader.events.error(up, error);
                    },

                    FilesAdded: (up: plupload.Uploader, files: UploaderFile[]) => {
                        // only one file allowed
                        if (up.files.length > 1)
                            up.removeFile(up.files[0]);

                        if (this.props.uploader.events && this.props.uploader.events.filesAdded)
                            this.props.uploader.events.filesAdded(up, files);

                        if (this._mounted)
                            this.setState({ ...this.state, selectedFile: up.files[0], percentUploaded: 0 });

                        // start upload imMediately on file select
                        if (this.props.uploadOnSelect)
                            up.start();
                    },

                    FileUploaded: (up: plupload.Uploader, file: UploaderFile, response: plupload_response) => {
                        const result = this.responseToResult(response);
                        if (!result.isSuccess && this._mounted) {
                            console.error("FileUploaded", response);
                            this.setErrors(resultToErrors(result));
                        }

                        if (this.props.uploader.events && this.props.uploader.events.fileUploaded)
                            this.props.uploader.events.fileUploaded(up, file, response);

                        if (this.props.onUploadComplete && result.isSuccess && result.data)
                            this.props.onUploadComplete(result.data);

                        // unset file-specific guid
                        up.settings.multipart_params.guid = undefined;

                        // clear file if option to upload on select is enabled
                        if (this.props.uploadOnSelect)
                            this.clearSelectedFile(result.isSuccess);
                    },

                    StateChanged: (up: plupload.Uploader) => {
                        if (this._mounted) {
                            this.setState({
                                ...this.state,
                                errors: up.state === plupload.STARTED ? [] : this.state.errors,
                                uploading: up.state === plupload.STARTED,
                            });
                        }
                    },

                    UploadComplete: (up: plupload.Uploader, files: UploaderFile[]) => {
                        if (this.props.uploader.events && this.props.uploader.events.uploadComplete)
                            this.props.uploader.events.uploadComplete(up, files);

                        this.clearSelectedFile(false);
                    },

                    UploadProgress: (up: plupload.Uploader, file: UploaderFile) => {
                        this.setState({ ...this.state, percentUploaded: file.percent });

                        if (this.props.uploader.events && this.props.uploader.events.uploadProgress)
                            this.props.uploader.events.uploadProgress(up, file);
                    },
                },
                multi_selection: false,
                unique_names : true,
            };

            this._uploader = new plupload.Uploader({
                ...settings,
                ...this.props.uploader,
                browse_button: picker,
                container,
            });

            if (this._uploader && this._mounted) {
                this._uploader.init();
                this.setState({ ...this.state, pluploadOk: true });
            }
        }
        else {
            console.warn("Plupload failed to load");
        }
    }

    public componentWillUnmount() {
        this._mounted = false;
    }

    public clearSelectedFile(clearErrors: boolean) {
        if (!this._mounted)
            return;

        this.setState({
            ...this.state,
            clearingFile: false,
            errors: clearErrors ? [] : this.state.errors,
            selectedFile: undefined,
            percentUploaded: 0,
            uploading: false,
        }, () => {
            if (this._uploader) {
                this._uploader.files = [];
            }
        });
    }

    public render() {
        const selectedFile = this.state.selectedFile;
        const errors = this.state.errors;
        const showErrors = errors.length > 0;
        const percent = this.state.percentUploaded;

        const fileDisplay = selectedFile
            ? <p className="mute selected-file">
                Selected file: <strong>{selectedFile.name}</strong> ({Utility.formatFileSize(selectedFile.origSize)})
            </p>
            : null;

        const percentDisplay = percent < 99
            ? `${percent}%`
            : <span><Icon icon="spinner fa-spin" /> Finalizing&hellip;</span>;

        const progress = this.state.uploading
            ? <div className="progress">
                <div
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={percent}
                    className={"progress-bar progress-bar-striped active " + (showErrors ? "progress-bar-danger" : "")}
                    role="progressbar"
                    style={{ width: percent + "%" }}
                >
                    {percentDisplay}
                </div>
            </div>
            : null;

        return <div className="file-uploader" id={this._idContainer}>
            <BS.ButtonGroup style={{ display: this.state.uploading || showErrors ? "none" : "inline-block" }}>
                {typeof this.props.renderBrowse === "function" ? this.props.renderBrowse(this._idPicker, this.props) : null}
                {this.props.buttons}
            </BS.ButtonGroup>

            {fileDisplay}

            {progress}

            <BS.Collapse isOpen={showErrors} timeout={125}>
                <BS.Alert color="danger">
                    <h3>File upload failed</h3>
                    <ul>
                        {errors && errors.map((e, i) => (<li key={i}>{e.toString()}</li>))}
                    </ul>
                    <p>
                        <a href="#" onClick={(e) => { ReactHelper.emptyClick(e); this.clearSelectedFile(true); }}>
                            Try again &raquo;
                        </a>
                    </p>
                </BS.Alert>
            </BS.Collapse>
        </div>;
    }

    /**
     * Converts a plupload response object into an IResult object.
     * @param resp The plupload response object
     */
    private responseToResult(resp: plupload_response | plupload_error | plupload_chunk_response): IResult<any> {
        try {
            const respJson = JSON.parse(resp.response);
            return respJson as IResult<any>;
        }
        catch (parseErr) {
            const result = new Result(resp.response as any);
            result.isSuccess = resp.status >= 200 && resp.status <= 201;
            result.errorCode = (resp as plupload_error).code || 1;
            result.message = (resp as plupload_error).message;

            if (!result.isSuccess) {
                if (result.message)
                    result.errors.push(result.message);
                if (resp.response)
                    result.errors.push(resp.response);
                if (!result.errors.length)
                    result.errors.push("Server error");
            }

            return result;
        }
    }

    private setErrors(errors: string[]) {
        this.setState({ ...this.state, errors });
    }
}

export const FileUploader: React.ComponentClass<FileUploaderProps> = connect(mapStateToProps, mapDispatchToProps)(FileUploaderComponent);
