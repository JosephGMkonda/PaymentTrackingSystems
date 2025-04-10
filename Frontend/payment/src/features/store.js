import { configureStore } from '@reduxjs/toolkit';
import authReducer from "./Authentication/AuthSlice";
import customerReducer from "./Customers/CustomersSlice"
import billsReducer from './Bill/BillSlice';
import paymentReducer from './Payments/PaymentSlice'
import analyticsReducer from './Home/AnalyticsSlice'
import reportReducer from "./Report/reportSlice"



export const store = configureStore({
  reducer: {
    auth: authReducer,
    customers: customerReducer,
    bills: billsReducer,
    payments: paymentReducer,
    analytics: analyticsReducer,
    report: reportReducer

  }
});