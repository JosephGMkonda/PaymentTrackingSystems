import {createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios"
import { toast } from "react-toastify";


const API_URL = `${import.meta.env.VITE_BASE_URL}/api/v1`;

export const fetchPayments = createAsyncThunk(
    "payments/fetchPayments",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`$((API_URL)/payments)`);
            console.log("Payments fetched successfully:", response.data)
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
            
        }
    }
);

export const getPaymentById = createAsyncThunk(
    "payments/getPaymentById",
    async (id, { rejectWithValue}) => {
        try {
            const response = await axios.get(`${API_URL}/payments/${id}`);
            console.log("Payment fetched successfully:", response.data)
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)


const paymentSlice = createSlice({
    name: "payments",
    initialState: {
        data: [],
        loading: false,
        error: null,
        selectedPayment: null,

    },

    reducers: {
        setSelectedPayment: (state, action) => {
            state.selectedPayment = action.payload;
        },

    },
    extraReducers: {
        [fetchPayments.pending]: (state) => {
            state.loading = true;
            state.error = null;
        },
        [fetchPayments.fulfilled]: (state, action) => {
            state.loading = false;
            state.data = action.payload;
        },
        [fetchPayments.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        [getPaymentById.pending]: (state) => {
            state.loading = true;
            state.error = null;
        },
        [getPaymentById.fulfilled]: (state, action) => {
            state.loading = false;
            state.data = action.payload;
        },
        [getPaymentById.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },


    }


})

export default paymentSlice.reducer;

