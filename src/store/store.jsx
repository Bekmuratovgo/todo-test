import { combineReducers, configureStore } from "@reduxjs/toolkit";
import adminReducer from "./adminSlice";

const rootReducer = combineReducers({
    adminReducer,
})

export const setupStore = () => {
    return configureStore({
        reducer: rootReducer,
    })
}