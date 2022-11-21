import { combineReducers, configureStore } from "@reduxjs/toolkit";
import todoReducer from "./todoSlice";

const rootReducer = combineReducers({
    todoReducer,
})

export const setupStore = () => {
    return configureStore({
        reducer: rootReducer,
    })
}
export type State = ReturnType<typeof rootReducer>


