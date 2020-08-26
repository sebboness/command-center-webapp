import { FormField } from ".";
import * as React from "react";
import * as RP from "react-placeholder";
import * as BS from "reactstrap";
import * as M from "../../models";
import { Icon } from "../generic";
import { FileUploader, FileUploaderProps, FileUploaderSettings } from "../upload";
import { ValidatedFormFieldBase } from "../validation";

interface OwnProps {
    id?: string;
    imageUrl: string | null;
    previewMaxWidth?: number;
    uploader: FileUploaderSettings;
}

interface OwnState {
    imgErr: boolean;
    imgSrc: string;
    loadingImg: boolean;
    showUploader: boolean;
}

export class ImageUploaderField extends ValidatedFormFieldBase<OwnProps, OwnState> {

    public constructor(props: OwnProps) {
        super(props as any);
        this.state = {
            imgErr: false,
            imgSrc: "",
            showUploader: !props.imageUrl,
            loadingImg: true,
        };
    }

    public componentDidMount() {
        this.tryLoadImage();
    }

    public componentDidUpdate(prevProps: Readonly<OwnProps>) {
        if (!prevProps.imageUrl && this.props.imageUrl) {
            this.tryLoadImage();
        }
        else if (prevProps.imageUrl && !this.props.imageUrl) {
            this.setState({ ...this.state, imgSrc: "", loadingImg: false, showUploader: true });
        }
        else if (prevProps.imageUrl && this.props.imageUrl && prevProps.imageUrl !== this.props.imageUrl) {
            this.tryLoadImage();
        }
    }

    public render() {
        const label = this.getLabel(this.props.label);
        const file: string | null = this.getValue() as string;
        return <FormField {...this.props} errors={this.getErrors()} label={label} name={this.props.name} required={this.isRequired(this.props.required)}>
            <BS.Collapse isOpen={this.state.showUploader}>
                <FileUploader
                    id={this.props.id}
                    uploader={this.props.uploader}
                    uploadOnSelect
                    onUploadComplete={(upload) => this.handleUploadComplete(upload)}
                    renderBrowse={(id: string, props: FileUploaderProps) => (
                        <BS.ButtonGroup>
                            <BS.Button id={id}>
                                <Icon icon="folder" /> {props.browseLabel || "Browse"}
                            </BS.Button>
                            {file
                                ? <BS.Button onClick={() => this.setState({ ...this.state, showUploader: false })}>
                                    Cancel
                                </BS.Button>
                                : null}
                        </BS.ButtonGroup>
                    )}
                />
            </BS.Collapse>

            <BS.Collapse isOpen={!this.state.showUploader}>
                {this.state.loadingImg
                    ? <RP.default type="rect" ready={false} showLoadingAnimation children={<></>} style={{ width: 300, height: 240 }} />
                    : <p>
                        <a href={this.state.imgSrc} target="_blank">
                            <img src={this.state.imgSrc} style={{ maxWidth: `${this.props.previewMaxWidth || 300}px` }} />
                        </a>
                    </p>}

                <BS.ButtonGroup>
                    <BS.Button onClick={() => this.setState({ ...this.state, showUploader: true })}>
                        Choose another image
                    </BS.Button>
                    <BS.Button color="link" onClick={() =>  this.handleFileClear()}>
                        Remove image
                    </BS.Button>
                </BS.ButtonGroup>
            </BS.Collapse>
        </FormField>;
    }

    private handleFileClear() {
        this.setState({ ...this.state, imgSrc: "", showUploader: true }, () => {
            this.props.formComponent.setFieldValue(this.props.name, null);
        });
    }

    private handleUploadComplete(upload: any) {
        const img = new Image();
        img.src = upload.url || "/";
        img.onerror = () => {
            this.setState({ ...this.state, imgErr: true, imgSrc: "" }, () => {
                this.props.formComponent.setFieldValue(this.props.name, null);
            });
        };
        img.onload = () => {
            this.setState({ ...this.state, imgErr: false, imgSrc: img.src, showUploader: false }, () => {
                this.props.formComponent.setFieldValue(this.props.name, upload.url || null);
            });
        };
    }

    private tryLoadImage() {
        if (this.props.imageUrl) {
            this.setState({ ...this.state, loadingImg: true }, () => {
                const img = new Image();
                img.src = this.props.imageUrl!;
                img.onerror = () => {
                    this.setState({ ...this.state, imgErr: true, imgSrc: "", loadingImg: false });
                };
                img.onload = () => {
                    this.setState({ ...this.state, imgErr: false, imgSrc: img.src, loadingImg: false, showUploader: false });
                };
            });
        }
    }
}
