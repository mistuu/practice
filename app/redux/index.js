import { combineReducers } from "redux";

import homeReducer from "./HomeReducer";

const rootReducer = combineReducers({
    homeReducer: homeReducer,
})

export default rootReducer;