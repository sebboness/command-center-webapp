import { Action } from "redux-actions";
import { ThunkAction } from "redux-thunk";
import { AppState } from "../store";

export type Thunk = ThunkAction<void, AppState, void>;

export type PromiseThunk<TPayload> = ThunkAction<Promise<Action<TPayload>>, AppState, void>;
