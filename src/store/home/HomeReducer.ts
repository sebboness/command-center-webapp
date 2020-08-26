import * as actions from "./HomeActions";
import { HomeState, initialHomeState } from "./HomeState";
import buildReducer from "../../utils/ReducerBuilder";

export const HomeReducer = buildReducer<HomeState>(initialHomeState)
    .handle(actions.onIsHomePageUpdated, (state, action) => ({
        ...state,
        isHomePage: action.payload || false,
    }))
    .done();
