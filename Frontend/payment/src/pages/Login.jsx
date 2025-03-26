import React, { useEffect, useState } from 'react';
import { BsFillPersonFill } from "react-icons/bs";
import { BsFillEyeSlashFill } from "react-icons/bs";
import { useDispatch, useSelector } from 'react-redux';
import { LoginUser, checkAuth } from '../features/Authentication/authSlice';
import { Navigate } from 'react-router-dom';

function Login() {
    const dispatch = useDispatch();
    const { isAuthenticated, loading, error } = useSelector((state) => state.auth);
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    useEffect(() => {
        dispatch(checkAuth());
    }, [dispatch]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(LoginUser(formData));
    };

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="w-96 p-6 shadow-lg bg-white rounded-md">
                <div className='flex justify-center mb-6'>
                    <h1 className='text-4xl font-bold'>
                        <span className="text-[#26344B]">Dzuwa</span>
                        <span className="text-[rgb(255,201,71)]">Gleam</span>
                    </h1>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="relative mb-4">
                        <input
                            type="text"
                            placeholder="Username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full p-2 pl-10 pr-2 mb-4 border rounded-md"
                        />
                        <BsFillPersonFill className='absolute left-3 top-2.5 text-gray-500 pointer-events-none'/>
                        {error?.username && (
                            <p className="text-red-500 text-sm mt-1">{error.username}</p>
                        )}
                    </div>
                    
                    <div className='relative mb-4'>
                        <input
                            type="password"
                            placeholder="Password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full p-2 pl-10 pr-2 border rounded-md"
                        />
                        <BsFillEyeSlashFill className="absolute left-3 top-2.5 text-gray-500 pointer-events-none"/>
                        {error?.password && (
                            <p className="text-red-500 text-sm mt-1">{error.password}</p>
                        )}
                    </div>
                    
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer disabled:opacity-50"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;