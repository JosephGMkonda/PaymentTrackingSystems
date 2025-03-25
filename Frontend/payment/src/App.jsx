import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './features/Layout'
import './index.css'
import Login from './pages/Login'

function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout/>}/>
        <Route path="/login" element={<Login/>}/>

      </Routes>
    </BrowserRouter>
   
    
  )
}

export default App
