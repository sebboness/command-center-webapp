import { createAction } from "redux-actions";
import { BreakPointPassType } from "./DocumentState";
import { Thunk } from "../../actions";
import Settings from "../../settings";

const prefix = "DOCUMENT_";

export class Constants {
    public static BODYCLASS_ADDED = prefix + "BODYCLASS_ADDED";
    public static BODYCLASS_REMOVED = prefix + "BODYCLASS_REMOVED";
    public static BREAKPOINT_PASSED = prefix + "BREAKPOINT_PASSED";
    public static RESIZED = prefix + "RESIZED";
    public static IS_SWIFTBOT = prefix + "IS_SWIFTBOT";
}

export const addBodyClass = (classList: string[]): Thunk => (dispatch, getState) => {
    dispatch(onBodyClassAdded(classList));
};

export const removeBodyClass = (classList: string[]): Thunk => (dispatch, getState) => {
    dispatch(onBodyClassRemoved(classList));
};

export const isSwiftBot = (): Thunk => (dispatch, getState) => {
    dispatch(onIsSwiftBot());
};

export const updateBodyClass = (classList: string[], isAdd: boolean): Thunk => (dispatch, getState) => {
    if (isAdd)
        dispatch(onBodyClassAdded(classList));
    else
        dispatch(onBodyClassRemoved(classList));
};

export const removeMaskedBodyClass = (): Thunk => (dispatch, getState) => {
    dispatch(onBodyClassRemoved(["masked", "menu-open", "search-open"]));
};

export const windowSizeUpdated = (): Thunk => (dispatch, getState) => {
    const prevWidth = getState().doc.width;
    const currWidth = window.innerWidth;
    const breakpoint = Settings.ResponsiveBreakpointWidth;

    if (prevWidth <= breakpoint && currWidth > breakpoint)
        dispatch(onBreakPoint(1)); // new width > breakpoint
    else if (prevWidth > breakpoint && currWidth <= breakpoint)
        dispatch(onBreakPoint(-1)); // new width < breakpoint

    dispatch(onWindowResized());
};

export const onBodyClassAdded = createAction<string[], string[]>(
    Constants.BODYCLASS_ADDED, (value) => (value),
);

export const onBodyClassRemoved = createAction<string[], string[]>(
    Constants.BODYCLASS_REMOVED, (value) => (value),
);

export const onBreakPoint = createAction<BreakPointPassType, BreakPointPassType>(
    Constants.BREAKPOINT_PASSED, (value) => (value),
);

export const onWindowResized = createAction(Constants.RESIZED);

export const onIsSwiftBot = createAction(Constants.IS_SWIFTBOT);
