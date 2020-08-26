import * as React from "react";
import { FormField } from "./FormField";

interface OwnProps {
    label?: string | null;
    isHtml?: boolean;
}

export const ReadonlyField: React.SFC<OwnProps> = (props) => {

    const content = props.isHtml
        ? <div dangerouslySetInnerHTML={{ __html: (props.children as string) }} />
        : props.children;

    return <FormField name="" label={props.label || ""}>
        {content}
    </FormField>;
};

export const ReadonlyAsDefListItem: React.SFC<OwnProps> = (props) => {
    return <>
        <dt>{props.label}</dt>
        {props.isHtml
            ? <dd dangerouslySetInnerHTML={{ __html: (props.children as string) }} />
            : <dd>{props.children}</dd>}
    </>;
};
