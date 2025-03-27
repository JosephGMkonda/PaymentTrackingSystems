import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = `${import.meta.env.VITE_BASE_URL}/api/v1`;

// Fetch all customers
export const fetchCustomers = createAsyncThunk(
  'customers/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/getAll`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Add new customer
export const addCustomer = createAsyncThunk(
  'customers/add',
  async (customerData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/post`, customerData);
      toast.success('Customer added successfully!');
      return response.data;
    } catch (error) {
      toast.error('Failed to add customer');
      return rejectWithValue(error.response.data);
    }
  }
);

// Update customer
export const updateCustomer = createAsyncThunk(
  'customers/update',
  async ({ id, customerData }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${API_URL}/updateCustomer/${id}`, customerData);
      toast.success('Customer updated successfully!');
      return response.data;
    } catch (error) {
      toast.error('Failed to update customer');
      return rejectWithValue(error.response.data);
    }
  }
);

// Delete customer
export const deleteCustomer = createAsyncThunk(
  'customers/delete',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/deleteCustomer/${id}`);
      toast.success('Customer deleted successfully!');
      return id;
    } catch (error) {
      toast.error('Failed to delete customer');
      return rejectWithValue(error.response.data);
    }
  }
);

const customerSlice = createSlice({
  name: 'customers',
  initialState: {
    data: [],
    loading: false,
    error: null,
    operationLoading: false
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Customers
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Add Customer
      .addCase(addCustomer.pending, (state) => {
        state.operationLoading = true;
      })
      addCase(addCustomer.fulfilled, (state, action) => {
        state.operationLoading = false;
      
      })
      .addCase(addCustomer.rejected, (state) => {
        state.operationLoading = false;
      })
      
      // Update Customer
      .addCase(updateCustomer.pending, (state) => {
        state.operationLoading = true;
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.operationLoading = false;
        
      })
      .addCase(updateCustomer.rejected, (state) => {
        state.operationLoading = false;
      })
      
      // Delete Customer
      .addCase(deleteCustomer.pending, (state) => {
        state.operationLoading = true;
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.operationLoading = false;
        state.data = state.data.filter(customer => customer.uuid !== action.payload);
      })
      .addCase(deleteCustomer.rejected, (state) => {
        state.operationLoading = false;
      });
  }
});

export default customerSlice.reducer;