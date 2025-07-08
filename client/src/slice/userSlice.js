import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    // id: '',
    username: '',
    score: 0
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        // setUserId: (state, action) => {
        //     state.id = action.payload;
        // },
        setUsername: (state, action) => {
            state.username = action.payload;
        },
        setUserScore: (state, action) => {
            state.score = action.payload;
        }
    }
})

export const { setUsername, setUserScore } = userSlice.actions;
export default userSlice.reducer;