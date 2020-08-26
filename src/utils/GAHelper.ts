import * as ReactGA from "react-ga";
import Settings from "../settings";

export const track = (loc: Location) => {
    if (Settings.GATrack)
        ReactGA.pageview(loc.pathname + (loc.search || "") + (loc.hash || ""));
};

export const setUser = (userId: string | number | undefined) => {
    if (Settings.GATrack)
        ReactGA.set({ userId });
};
