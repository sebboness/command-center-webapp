import * as React from "react";
import { Utility } from "../../utils";

const isSSR = Utility.isServer();

type OwnProps = React.ImgHTMLAttributes<any> & {
    src: string;
};

interface OwnState {
}

export class ImageDisplay extends React.Component<OwnProps, OwnState> {

    public constructor(props: OwnProps) {
        super(props as any);

        if (!isSSR)
            this.tryLoadImage();

    }

    public componentDidUpdate(prevProps: Readonly<OwnProps>) {
        const src = this.props.src;
        const prevSrc = prevProps.src;

        if (!prevSrc && src) {
            this.tryLoadImage();
        }
        else if (prevSrc && src && prevSrc !== src) {
            this.tryLoadImage();
        }
    }

    public render() {
        return <img { ...this.props } />;
    }

    private tryLoadImage() {
        const img = new Image();
        img.src = this.props.src;
    }
}
