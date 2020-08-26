import { AlertReducer, AlertState, initialAlertState } from "./alert";
import { DocumentReducer, DocumentState, initialDocumentState } from "./document";
import { HomeReducer, HomeState, initialHomeState } from "./home";
import { initialNotificationState, NotificationReducer, NotificationState } from "./notification";

// The top-level state object
export interface AppState {
    alert: AlertState;
    doc: DocumentState;
    home: HomeState;
    notification: NotificationState;
}

export const initialState: AppState = {
    alert: initialAlertState,
    doc: initialDocumentState,
    home: initialHomeState,
    notification: initialNotificationState,
};

// Whenever an action is dispatched, Redux will update each top-level application state property using
// the reducer with the matching name. It"s important that the names match exactly, and that the reducer
// acts on the corresponding AppState property type.
export const reducers = {
    alert: AlertReducer,
    doc: DocumentReducer,
    home: HomeReducer,
    notification: NotificationReducer,
};

// This type can be used as a hint on action creators so that its "dispatch" and "getState" params are
// correctly typed to match your store.
export type AppThunkAction<TAction> = (dispatch: (action: TAction) => void, getState: () => AppState) => void;
