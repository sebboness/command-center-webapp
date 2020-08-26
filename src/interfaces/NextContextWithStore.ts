import * as http from "http";
import { NextContext } from "next";
import { AppState } from "../store";
import { Store } from "redux";

export type NextContextWithStore = NextContext & {
    req?: http.IncomingMessage & { protocol: string; };
    store: Store<AppState>;
};
