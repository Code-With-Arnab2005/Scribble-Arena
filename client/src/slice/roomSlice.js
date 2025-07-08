import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    roomId: '',
    rounds: 3,
}

const roomSlice = createSlice({
    name: 'room',
    initialState,
    reducers: {
        setRoomId: (state, action) => {
            state.roomId = action.payload;
        },
        setRounds: (state, action) => {
            state.rounds = action.payload;
        }
    }
})

export const { setRoomId, setRounds } = roomSlice.actions;
export default roomSlice.reducer;