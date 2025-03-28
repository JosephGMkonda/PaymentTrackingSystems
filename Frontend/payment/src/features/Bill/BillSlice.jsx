import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/v1/monthlyBills`;

export const fetchBills = createAsyncThunk(
  'bills/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/getAll`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addBill = createAsyncThunk(
  'bills/add',
  async (billData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/post`, billData);
      toast.success('Monthly bill created successfully!');
      return response.data.bill; // Return the created bill
    } catch (error) {
      toast.error(error.response?.data?.msg || 'Failed to create bill');
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateBill = createAsyncThunk(
  'bills/update',
  async ({ id, billData }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${API_URL}/updateBill/${id}`, billData);
      toast.success('Bill updated successfully!');
      return response.data;
    } catch (error) {
      toast.error('Failed to update bill');
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteBill = createAsyncThunk(
  'bills/delete',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/deleteBill/${id}`);
      toast.success('Bill deleted successfully!');
      return id;
    } catch (error) {
      toast.error('Failed to delete bill');
      return rejectWithValue(error.response.data);
    }
  }
);

const billsSlice = createSlice({
  name: 'bills',
  initialState: {
    data: [],
    loading: false,
    error: null,
    operationLoading: false
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBills.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBills.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchBills.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addBill.pending, (state) => {
        state.operationLoading = true;
      })
      .addCase(addBill.fulfilled, (state, action) => {
        state.operationLoading = false;
        state.data.unshift(action.payload);
      })
      .addCase(addBill.rejected, (state) => {
        state.operationLoading = false;
      });
      .addCase(updateBill.pending, (state) => {
        state.operationLoading = true;
      })
      .addCase(updateBill.fulfilled, (state, action) => {
        state.operationLoading = false;
        const index = state.data.findIndex(b => b.id === action.payload.id);
        if (index !== -1) {
          state.data[index] = action.payload;
        }
      })
      .addCase(updateBill.rejected, (state) => {
        state.operationLoading = false;
      })
      .addCase(deleteBill.pending, (state) => {
        state.operationLoading = true;
      })
      .addCase(deleteBill.fulfilled, (state, action) => {
        state.operationLoading = false;
        state.data = state.data.filter(bill => bill.id !== action.payload);
      })
      .addCase(deleteBill.rejected, (state) => {
        state.operationLoading = false;
      });
  }
});

export default billsSlice.reducer;