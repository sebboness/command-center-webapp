import { is } from "immutable";
import * as React from "react";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import { LightboxImage } from "../../models/lightbox";

interface OwnProps {
    images: LightboxImage[];
}

interface OwnState {
    index: number;
    isOpen: boolean;
    sources: string[];
    titles: React.ReactNode[];
    captions: React.ReactNode[];
}

export class LightboxModal extends React.Component<OwnProps, OwnState> {

    public constructor(props: OwnProps) {
        super(props);

        this.state = {
            captions: [],
            index: 0,
            isOpen: false,
            sources: [],
            titles: [],
        };

        this.openLightbox = this.openLightbox.bind(this);
        this.closeLightbox = this.closeLightbox.bind(this);
        this.moveNext = this.moveNext.bind(this);
        this.movePrev = this.movePrev.bind(this);
    }

    public componentDidMount() {
        this.initializeImages(this.props.images);
    }

    public componentDidUpdate(prevProps: Readonly<OwnProps>) {
        if (!is(prevProps.images, this.props.images)) {
            this.initializeImages(this.props.images);
        }
    }

    public openIndex(index: number) {
        this.setState({
            index,
            isOpen: true,
        });
    }

    public render() {
        let lightbox = null;

        if (this.state.isOpen) {
            lightbox = (
                <Lightbox
                    mainSrc={this.state.sources[this.state.index]}
                    nextSrc={this.state.sources[(this.state.index + 1) % this.state.sources.length]}
                    prevSrc={
                        this.state.sources[(this.state.index + this.state.sources.length - 1) % this.state.sources.length]
                    }
                    // mainSrcThumbnail={this.state.thumbs[this.state.index]}
                    // nextSrcThumbnail={this.state.thumbs[(this.state.index + 1) % this.state.sources.length]}
                    // prevSrcThumbnail={
                    //     this.state.thumbs[(this.state.index + this.state.sources.length - 1) % this.state.sources.length]
                    // }
                    onCloseRequest={this.closeLightbox}
                    onMovePrevRequest={this.movePrev}
                    onMoveNextRequest={this.moveNext}
                    onImageLoadError={function() { console.log(arguments); }}
                    imageTitle={this.state.titles[this.state.index]}
                    imageCaption={this.state.captions[this.state.index]}
                />
            );
        }

        return lightbox;
    }

    private initializeImages(images: LightboxImage[]) {
        const captions: React.ReactNode[] = [];
        const sources: string[] = [];
        const titles: React.ReactNode[] = [];

        for (const img of images) {
            const caption = img.caption || "";

            sources.push(img.src);
            captions.push(typeof caption === "string"
                ? <div dangerouslySetInnerHTML={{ __html: caption || "" }} />
                : caption);
            titles.push(img.title);
        }

        this.setState({
            captions,
            sources,
            titles,
        });
    }

    private openLightbox() {
        this.setState({ isOpen: true });
      }

    private closeLightbox() {
        this.setState({ isOpen: false });
    }

    private moveNext() {
        this.setState((prevState) => ({
            index: (prevState.index + 1) % this.state.sources.length,
        }));
    }

    private movePrev() {
        this.setState((prevState) => ({
            index: (prevState.index + this.state.sources.length - 1) % this.state.sources.length,
        }));
    }
}
