import { useState } from 'react'
import {BrowserRouter,Routes,Route,Navigate} from 'react-router-dom'
import Register from './Register'
import Login from './Login'
import PDash from './PDash'
import Common from './Common'
import './App.css';


function App() {
 const isAuth = localStorage.getItem('token')

  return (
    <>
     <div className='min-h-screen  text-white'>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register/>}></Route>    
        <Route path="/login" element={<Login/>}></Route>   
        <Route path="/dash" element={isAuth ? <PDash/> : <Navigate to="/login"/>}></Route>    
        <Route path="/common" element={isAuth ? <Common/> : <Navigate to="/login"/>}></Route>         



      </Routes>
      </BrowserRouter>
     </div>
    </>
  )
}

export default App
