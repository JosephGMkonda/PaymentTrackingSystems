import { configureStore } from '@reduxjs/toolkit';
import authReducer from "./Authentication/AuthSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});