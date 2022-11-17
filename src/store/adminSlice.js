import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    users: [],
    oneUser: [],
    users_length: 0,
    isLoading: false,
    errors: '',
    count: null,
    _token: null,
    result_valid_inn: true,
    errors_inn: '',
    address: [],
    inn: [],
}

export const adminSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        usersFetchingLoading (state) {
            state.isLoading = true;
        },
        usersFetchingSuccess (state, action) {
            state.isLoading = false;
            state.errors = '';
            state.users = action.payload.users || [];
            state.count = action.payload.count
        },
        usersFetchingError (state, action) {
            state.isLoading = false;
            state.errors = action.payload;
        },
        usersFetchForEditSuccess (state, action) {
            state.oneUser = action.payload;
        },
        fetchUserToken (state, action) {
            state._token = action.payload
        },
        fetchError (state, action) {
            state.errors = action.payload
        },
        ResultValidateInn (state, action) {
            state.result_valid_inn = action.payload
        },
        ErrorsInn (state, action) {
            state.errors_inn = action.payload
        },
        UserInn (state, action) {
            state.inn = action.payload;
        },
        UserAddress (state, action) {
            state.address = action.payload;
        },
        UserPhoto (state, action) {
            state.oneUser = {...state.oneUser, avatar: action.payload};
        },

    }
})

export default adminSlice.reducer;