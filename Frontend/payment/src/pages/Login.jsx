import React from 'react'
import { BsFillPersonFill } from "react-icons/bs";
import { BsFillEyeSlashFill } from "react-icons/bs";
function Login() {
  return (
    <div className="flex justify-center items-center h-screen">
    <div className="w-96 p-6 shadow-lg bg-white rounded-md">
    <div className='flex justify-center mb-6'>
  <h1 className='text-4xl font-bold'>
    <span className="text-[#26344B]">Dzuwa</span>

    <span className="text-[rgb(255,201,71)]">Gleam</span>
  </h1>
</div>

      <div>

        <form >

      <div className="relative mb-4">
        <input
        type="text"
        placeholder="Username"
        name="username"
    
        className="w-full p-2 pl-10 pr-2  mb-4 border rounded-md"
        />
        <BsFillPersonFill className='absolute left-3 top-2.5 text-gray-500 pointer-events-none'/>
        {/* {errors.username && (
          <p className="text-red-500 text-sm mt-1">{errors.username}</p>
        )} */}
      </div>
      <div className='relative mb-4'>
        <input
        type="password"
        placeholder="Password"
        name="password"
        
        className="w-full p-2 pl-10 pr-2 border rounded-md"
        />
        <BsFillEyeSlashFill className="absolute left-3 top-2.5 text-gray-500 pointer-events-none"/>
      
        {/* {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password}</p>
        )} */}

      </div>
        
        
        
      <button
        type="submit"
    
        className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer"
      >
        Login
      </button>

      </form>
        </div>

        
     

    </div>
    
</div>
    
  )
}

export default Login