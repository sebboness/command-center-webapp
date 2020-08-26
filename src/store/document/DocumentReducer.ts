import * as actions from "./DocumentActions";
import { DocumentState, initialDocumentState } from "./DocumentState";
import buildReducer from "../../utils/ReducerBuilder";

export const DocumentReducer = buildReducer<DocumentState>(initialDocumentState)
    .handle(actions.onBodyClassAdded, (state, action) => {
        if (!action.payload)
            return { ...state };

        for (const c of action.payload)
            document.body.classList.add(c);

        return {
            ...state,
            bodyClass: action.payload,
        };
    })
    .handle(actions.onBodyClassRemoved, (state, action) => {
        if (!action.payload)
            return { ...state };

        for (const c of action.payload)
            document.body.classList.remove(c);

        return {
            ...state,
            bodyClass: action.payload,
        };
    })
    .handle(actions.onBreakPoint, (state, action) => ({
        ...state,
        breakpointPassed: action.payload,
    }))
    .handle(actions.onIsSwiftBot, (state, action) => ({
        ...state,
        isSwiftBot: true,
    }))
    .handle(actions.onWindowResized, (state, action) => ({
        ...state,
        height: typeof window !== "undefined" ? window.innerHeight : state.height,
        width: typeof window !== "undefined" ? window.innerWidth : state.width,
    }))
    .done();
