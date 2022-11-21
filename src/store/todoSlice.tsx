import { createSlice } from "@reduxjs/toolkit";
import { InitialState } from "../interface";

const initialState: InitialState = {
    todos: [],
    isOpen: false,
    loading: false,
    editCurrentCard: null,
    isChecked: false,
    time: null
}

export const todoSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setLoading (state, action) {
            state.loading = action.payload;
        },
        setModalToggle (state, action) {
            state.isOpen = action.payload;
        },
        setEditCurrentCard (state, action) {
            state.editCurrentCard = action.payload;
        },
        setAllTodos (state, action) {
            state.todos = action.payload;
        },
        setChecked (state, action) {
            state.isChecked = action.payload;
        },

    }
})

export default todoSlice.reducer;