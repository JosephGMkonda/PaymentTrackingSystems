import { configureStore } from '@reduxjs/toolkit';
import authReducer from "./Authentication/AuthSlice";
import customerReducer from "./Customers/CustomersSlice"
import billsReducer from './Bill/BillSlice';
import paymentReducer from './Payments/PaymentSlice'



export const store = configureStore({
  reducer: {
    auth: authReducer,
    customers: customerReducer,
    bills: billsReducer,
    payments: paymentSlice

  }
});