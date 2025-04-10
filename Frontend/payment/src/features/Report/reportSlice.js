import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1';

export const fetchMonthlyReport = createAsyncThunk(
    'report/fetchMonthlyReport',
    async ({ year, month }, { rejectWithValue }) => {
      try {
        // Convert and validate parameters
        const yearNum = parseInt(year);
        const monthNum = parseInt(month);
  
        if (isNaN(yearNum)) {
          throw new Error('Invalid year parameter. Must be a number.');
        }
  
        if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
          throw new Error('Invalid month parameter. Must be between 1 and 12.');
        }
  
        const response = await axios.get(`${API_URL}/monthly-report/${yearNum}/${monthNum}`);
        
        if (!response.data.success) {
          throw new Error(response.data.message || 'Request failed');
        }
        
        return response.data.data;
      } catch (error) {
        console.error('Report fetch error:', error);
        return rejectWithValue(error.response?.data?.message || error.message);
      }
    }
  );

const reportSlice = createSlice({
  name: 'report',
  initialState: {
    loading: false,
    error: null,
    report: null,
  },
  reducers: {
    
    clearReport: (state) => {
      state.report = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMonthlyReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMonthlyReport.fulfilled, (state, action) => {
        state.loading = false;
        state.report = action.payload;
      })
      .addCase(fetchMonthlyReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});


export const { clearReport } = reportSlice.actions;
export default reportSlice.reducer;