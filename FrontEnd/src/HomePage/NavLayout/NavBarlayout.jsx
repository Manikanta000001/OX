import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar/Navbar'

const NavBarlayout = () => {
  return (
    <>
    <Navbar/>
    <div className="container">
         <Outlet/>
    </div>
    </>
  )
}

export default NavBarlayout