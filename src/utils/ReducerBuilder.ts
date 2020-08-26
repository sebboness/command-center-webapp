import { Reducer, Action } from "redux-actions";
import { ActionCreator } from "redux";

interface ReducerBuilderObject<TState> {
    handle: <TPayload>(
        creator: ActionCreator<Action<TPayload>>,
        reducer: Reducer<TState, TPayload>,
    ) => ReducerBuilderObject<TState>;
    done: () => Reducer<TState, Action<any>>;
}
export default function buildReducer<TState>(initialState?: TState): ReducerBuilderObject<TState> {
    const map: { [action: string]: Reducer<TState, any>; } = {};

    function createHandler(creator: ActionCreator<Action<any>>, reducer: Reducer<TState, any>) {
        const type = creator.toString();
        if (map[type])
            throw new Error (`Already handling an action with type ${type}`);

        map[type] = reducer;
    }

    return {
        handle(creator, reducer) {
            createHandler(creator, reducer);
            return this;
        },
        done() {
            const mapClone = Object.assign({}, map);
            return (state: TState = initialState as any, action: Action<any>) => {
                const handler = mapClone[action.type];
                return handler ? handler(state, action) : state;
            };
        },
    };
}
