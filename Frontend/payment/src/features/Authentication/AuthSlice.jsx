import{createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from 'axios'

const API_URL=`${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_API_URL}`;

export const LoginUser = createAsyncThunk(
    'auth/login',
    async ({username,password}, {rejectWithValue}) => {
        try {
            console.log('Full API URL:', `${API_URL}/login`);
            const response = await axios.post(

                `${API_URL}/login`,
                {username, password},
                {withCredentials: true}
            );
            return response.data.user;
        } catch (error) {
            return rejectWithValue(error.response.data);
            
        }
    }

)

export const checkAuth = createAsyncThunk(
    'auth/checkAuth',
    async (_, {rejectWithValue}) => {
        try {
            const response = await axios.get(
                `${API_URL}/check-auth`,
                {withCredentials: true}
            );
            return response.data.user;

        } catch (error) {
            return rejectWithValue(error.response.data);
            
        }
    }
)

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        loading: false,
        error: null,
        isAuthenticated: false
    },
    reducers: {
        logout: (state) => {
         state.user = null;
         state.isAuthenticated = false
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(LoginUser.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isAuthenticated = true;
                state.loading = false;
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isAuthenticated = !!action.payload;
            })
    }

});
export const {logout} = authSlice.actions;
export default authSlice.reducer;
