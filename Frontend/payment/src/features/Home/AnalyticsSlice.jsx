
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "axios"


const API_URL = `${import.meta.env.VITE_BASE_URL}/api/v1`;

export const fetchAnalytics = createAsyncThunk(
  'analytics/fetchAnalytics',
  async () => {
    const response = await axios.get(`${API_URL}/analytics`);
    
    return response.data;
  }
);

export const fetchBillTrends = createAsyncThunk(
  'analytics/billsTrends',
  async () => {
    const response = await axios.get(`${API_URL}/bllingTrends`);
    
    return response.data;
  }
);


export const fetchPaymentsTrends = createAsyncThunk(
  'analytics/paymentsTrends',
  async () => {
    const response = await axios.get(`${API_URL}/historicalPayments`);
    console.log("Historical Paymentss", response.data)
    return response.data;
  }
);

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState: {
    data: null,
    billsTrends: null,
    historicalPayments: null,
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchAnalytics.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchBillTrends.fulfilled, (state, action) => {
        state.billsTrends = action.payload;
      })

      .addCase(fetchPaymentsTrends.fulfilled, (state, action) => {
        state.historicalPayments = action.payload;  
      })


      
  }
});

export default analyticsSlice.reducer;