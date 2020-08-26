import React from "react";
import { FormField } from "./";
import { loadTinymce, TinymceOptions } from "../../interfaces/tinymce";
import { ValidatedFormFieldBase, ValidatedTextArea } from "../validation";
import { Utility } from "../../utils";

declare const tinymce: any;

interface OwnProps {
    css?: string;
    id?: string;
    isAdmin?: boolean;
    placeholder?: string;
    onInputChange?: (fieldName: string, value: string) => void;
    options?: object;
    type?: string;
}

interface OwnState {
    editor?: any;
}

export class RichTextField extends ValidatedFormFieldBase<OwnProps, OwnState> {

    private checkInterval: NodeJS.Timeout | undefined;
    private isServer = Utility.isServer();
    private _isMounted = false;

    public constructor(props: any) {
        super(props);
        this.state = {
        };

        if (!this.isServer) {
            loadTinymce().then();
        }
    }

    public componentDidMount() {
        this._isMounted = true;
        if (!this.isServer) {
            if ((window as any).tinymce && (window as any).tinymceLoaded) {
                this.initTinymce();
            }
            else {
                this.checkInterval = setInterval(() => {
                    if ((window as any).tinymce && (window as any).tinymceLoaded && this._isMounted) {
                        clearInterval(this.checkInterval!);
                        this.initTinymce();
                    }
                }, 25);
            }
        }
    }

    public componentDidUpdate() {
        if (this.state.editor && !this.isServer && this._isMounted) {
            const inputVal = this.props.formComponent.getFieldValue(this.props.name);
            const editorVal = this.state.editor.getContent();
            if (inputVal !== editorVal) {
                this.state.editor.setContent(inputVal || "");
            }
        }
    }

    public componentWillUnmount() {
        this._isMounted = false;
        if (this.state.editor && !this.isServer)
            this.state.editor.remove();
    }

    public render() {
        return <FormField {...this.props} errors={this.getErrors()} label={this.getLabel(this.props.label)} name={this.props.name} required={this.isRequired(this.props.required)}>
            <div>
                <ValidatedTextArea
                    formComponent={this.props.formComponent}
                    id={this.props.id || Utility.toHtmlIdString(this.props.name)}
                    name={this.props.name}
                    css={this.props.css || "txt-med"}
                    placeholder={this.props.placeholder}
                    value={this.props.value}
                />
            </div>
            {this.props.children}
        </FormField>;
    }

    private initTinymce() {
        // default public or admin?
        let options: any = TinymceOptions.defaultPublic();
        if (this.props.isAdmin)
            options = { ...TinymceOptions.defaultAdmin };

        const id = this.props.id || Utility.toHtmlIdString(this.props.name);
        options.selector = `#${id}`;
        options.setup = (editor: any) => {
            this.setState({ ...this.state, editor });
            editor.on("keyup change", () => {
                const content = editor.getContent();
                if (this.props.onInputChange)
                    this.props.onInputChange(this.props.name, content);

                const textarea = document.getElementById(id || "") as HTMLTextAreaElement;
                if (textarea)
                    textarea.value = content;

                this.props.formComponent.setFieldValue(this.props.name,  content);
            });
            editor.on("blur", () => {
                this.props.formComponent.triggerBlur(this.props.name);
            });
        };

        // extra options provided
        if (this.props.options) {
            options = {
                ...options,
                ...this.props.options,
            };
        }

        if (this._isMounted) {
            tinymce.init(options);
        }
    }
}
