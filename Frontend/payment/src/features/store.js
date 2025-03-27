import { configureStore } from '@reduxjs/toolkit';
import authReducer from "./Authentication/AuthSlice";
import customerReducer from "./Customers/CustomersSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    customers: customerReducer
  },
});