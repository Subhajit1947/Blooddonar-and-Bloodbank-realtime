import React from 'react'
import Navbar from './Navbar'
import { Outlet } from 'react-router-dom'
import Footer from './Footer'
function Layout({t}) {
  return (
    <>
    <Navbar t={t}/>
    <Outlet/>
    <Footer/>
    </>
  )
}

export default Layout