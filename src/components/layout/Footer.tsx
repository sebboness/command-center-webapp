import * as React from "react";

interface OwnProps {
}

export const Footer: React.SFC<OwnProps> = () => {
    return <footer className="footer">
        <div className="content">
            <address className="vcard">
                <span className="org"><a href="https://www.miteksystems.com">Mitek Systems, Inc.</a></span>
            </address>

            <ul className="colophon">
                <li>&copy; {new Date().getFullYear()} Mitek Systems, Inc.</li>
            </ul>
        </div>
    </footer>;
};
