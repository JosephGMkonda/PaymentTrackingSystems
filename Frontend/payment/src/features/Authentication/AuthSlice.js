import{createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from axios;

const API_URL=`${process.env.BASE_URL}${process.env.API_URL}`;

export const Login = createAsyncThunk(
    'auth/login',
    async ({username,password}, {rejectWithValue}) => {
        try {
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
            .addCase(Login.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isAuthenticated = true;
                state.loading = false;
            })
            .addCase(chechAuth.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isAuthenticated = !!action.payload;
            })
    }

});
export const {logout} = authSlice.actions;
export default authSlice.reducer;
