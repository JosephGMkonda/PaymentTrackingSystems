// billsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1';

// Async Thunks
export const fetchBills = createAsyncThunk('bills/fetchBills', async () => {
  const response = await axios.get(`${API_URL}/getAllBills`);
  return response.data;
});

export const fetchCustomers = createAsyncThunk('bills/fetchCustomers', async () => {
  const response = await axios.get(`${API_URL}/getAll`); // Add your customer endpoint
  return response.data;
});

export const addBill = createAsyncThunk('bills/addBill', async (billData) => {
  const response = await axios.post(`${API_URL}/Billpost`, billData);
  return response.data;
});

export const updateBill = createAsyncThunk('bills/updateBill', async ({ id, billData }) => {
  const response = await axios.patch(`${API_URL}/updateBill/${id}`, billData);
  return response.data;
});

export const deleteBill = createAsyncThunk('bills/deleteBill', async (id) => {
  await axios.delete(`${API_URL}/deleteBill/${id}`);
  return id;
});

const BillSlice = createSlice({
  name: 'bills',
  initialState: {
    bills: [],
    customers: [],
    status: 'idle',
    error: null,
    currentBill: null,
    isModalOpen: false,
    modalType: '',
    customerStatus: 'idle'
  },
  reducers: {
    setCurrentBill: (state, action) => {
      state.currentBill = action.payload;
    },
    openModal: (state, action) => {
      state.isModalOpen = true;
      state.modalType = action.payload;
    },
    closeModal: (state) => {
      state.isModalOpen = false;
      state.currentBill = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBills.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBills.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.bills = action.payload;
      })
      .addCase(fetchBills.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchCustomers.pending, (state) => {
        state.customerStatus = 'loading';
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.customerStatus = 'succeeded';
        state.customers = action.payload;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.customerStatus = 'failed';
        state.error = action.error.message;
      })
      .addCase(addBill.fulfilled, (state, action) => {
        state.bills.push(action.payload);
      })
      .addCase(updateBill.fulfilled, (state, action) => {
        const index = state.bills.findIndex(bill => bill.uuid === action.payload.uuid);
        if (index !== -1) {
          state.bills[index] = action.payload;
        }
      })
      .addCase(deleteBill.fulfilled, (state, action) => {
        state.bills = state.bills.filter(bill => bill.uuid !== action.payload);
      });
  },
});

export const { setCurrentBill, openModal, closeModal } = BillSlice.actions;
export default BillSlice.reducer;