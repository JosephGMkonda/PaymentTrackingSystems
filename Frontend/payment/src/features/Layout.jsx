import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'

function Layout() {
  return (
    <div className="flex flex-col h-screen">
    
      <Navbar />
      
      <div className="flex flex-1 overflow-hidden">
        
        <Sidebar />
        
      
        <main className="flex-1 overflow-y-auto p-4 bg-gray-50 ml-[18%] mt-[70px]">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout