import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import roomReducer from './roomSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    room: roomReducer,
  },
});