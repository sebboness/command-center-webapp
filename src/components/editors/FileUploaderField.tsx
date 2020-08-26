import React from "react";
import { FormField, Hidden } from "./";
import { Icon } from "../generic";
import { FileUploader, FileUploaderProps, FileUploaderSettings } from "../upload";
import { ValidatedFormFieldBase } from "../validation";
import { IResult } from "../../models/result";
import { Utility } from "../../utils";

interface OwnProps {
    uploader: FileUploaderSettings;
    uploadOnSelect?: boolean;
    onClearFile?: (file: any) => Promise<IResult<any>>;
    onUploadComplete?: (upload: any) => void;
    renderBrowse?: (id: string, props: FileUploaderProps) => JSX.Element;
}

interface OwnState {
    clearingFile: boolean;
}

export class FileUploaderField extends ValidatedFormFieldBase<OwnProps, OwnState> {

    public constructor(props: any) {
        super(props);
        this.state = {
            clearingFile: false,
        };
    }

    public render() {
        const label = this.getLabel(this.props.label);
        const file: any | undefined = this.getValue();
        let details = <FileUploader
                uploader={this.props.uploader}
                uploadOnSelect={this.props.uploadOnSelect}
                onUploadComplete={(upload) => this.handleUploadComplete(upload)}
                renderBrowse={this.props.renderBrowse}
            />;

        if (file) {
            if (this.state.clearingFile)
                details = <p><Icon icon="spinner fa-spin" /> Clearing file&hellip;</p>;
            else
                details = <p>
                    <a href={file.url} target="_blank">{file.fileName} ({Utility.formatFileSize(file.size || 0)})</a>
                    <br />
                    <a className="mute" href="#" onClick={(e) => this.handleFileClear(e, file)}>Clear file</a>
                </p>;
        }

        return <FormField {...this.props} errors={this.getErrors()} label={label} name={this.props.name} required={this.isRequired(this.props.required)}>
            <Hidden formComponent={this.props.formComponent} name={this.props.name + ".guid"} />
            <Hidden formComponent={this.props.formComponent} name={this.props.name + ".fileName"} />
            {details}
        </FormField>;
    }

    private handleFileClear(e: React.MouseEvent<HTMLAnchorElement>, file: any) {
        if (this.props.onClearFile) {
            this.setState({ ...this.state, clearingFile: true });
            this.props.onClearFile(file).then((_result) => {
                // on success
                this.props.formComponent.setFieldValue(this.props.name, undefined);
            }, (err) => {
                // skip error
                console.warn("file upload clear failed", err);
                this.props.formComponent.handleValidationErrors([{
                    inputName: this.props.name,
                    errors: [err],
                }], this.props.name);
            })
            .then(() => {
                this.setState({ ...this.state, clearingFile: false });
            });
        }
        else
            console.warn("FileUploaderField: No onClearFile() prop method has been defined");

        e.preventDefault();
        return false;
    }

    private handleUploadComplete(upload: any) {
        const file: any = {
            fileName: upload.fileName,
            guid: upload.guid,
            size: upload.size,
            thumbMd: upload.thumbMd,
            thumbSm: upload.thumbSm,
            url: upload.url,
        };
        this.props.formComponent.setFieldValue(this.props.name, file);

        if (this.props.onUploadComplete)
            this.props.onUploadComplete(upload);
    }
}
