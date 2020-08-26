import { createAction } from "redux-actions";
import { Thunk } from "../../actions";

const prefix = "HOME_";

class Constants {
    public static IS_HOME_PAGE = prefix + "IS_HOME_PAGE";
}

export const setIsHomePage = (isHomePage: boolean): Thunk => (dispatch, getState) => {
    dispatch(onIsHomePageUpdated(isHomePage));
};

export const onIsHomePageUpdated = createAction<boolean, boolean>(
    Constants.IS_HOME_PAGE, (value) => (value),
);
