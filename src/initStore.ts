import { applyMiddleware, combineReducers, compose, createStore, GenericStoreEnhancer, ReducersMapObject, Store, StoreEnhancerStoreCreator } from "redux";
// import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import { AppState, reducers } from "./store";

// export const initStore = (initialState?: AppState) => {
//     return createStore(combineReducers<AppState>(reducers), initialState, composeWithDevTools(applyMiddleware(thunkMiddleware)));
// }

export function initStore(initialState?: AppState) {
    // Build middleware. These are functions that can process the actions before they reach the store.
    const windowIfDefined = typeof window === "undefined" ? null : window as any;
    // If devTools is installed, connect to it
    const devToolsExtension = windowIfDefined && windowIfDefined.__REDUX_DEVTOOLS_EXTENSION__ as () => GenericStoreEnhancer;
    const createStoreWithMiddleware = compose(
        applyMiddleware(thunk),
        devToolsExtension ? devToolsExtension() : <S>(next: StoreEnhancerStoreCreator<S>) => next,
    )(createStore) as (reducers: any, initialState: AppState | undefined) => Store<AppState>;

    // Combine all reducers and instantiate the app-wide store instance
    const allReducers = buildRootReducer(reducers);

    const store = createStoreWithMiddleware(allReducers, initialState) as Store<AppState>;

    return store;
}

function buildRootReducer(allReducers: ReducersMapObject) {
    return combineReducers<AppState>(Object.assign({}, allReducers));
}
