import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import DonateBlood from './DonateBlood'
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
function Dashboarddonar() {
  const user=useSelector((state)=>state.user)
  return (
    <div className='flex h-screen w-screen'>
        <div className='h-full w-1/4 bg-red-800 pl-3 flex flex-col'>
          {user.isAdmin?<>
            <NavLink to='/dashboard/alluser' className={({isActive})=>{return isActive?'cursor-pointer p-3 text-black':'text-white cursor-pointer p-3'}}>All users</NavLink> 
          <NavLink></NavLink></>:
          <>
          <NavLink to='/dashboard/donate' className={({isActive})=>{return isActive?'cursor-pointer p-3 text-black':'text-white cursor-pointer p-3'}}>Donate Blood</NavLink> 
           <NavLink to='/dashboard/blood-request' className={({isActive})=>{return isActive?'cursor-pointer p-3 text-black':'text-white cursor-pointer p-3'}}>request for Blood</NavLink> 
           
          </>
          }
           <NavLink to='/dashboard/request-history' className={({isActive})=>{return isActive?'cursor-pointer p-3 text-black':'text-white cursor-pointer p-3'}}>view request history</NavLink> 
           <NavLink to='/dashboard/donar-history' className={({isActive})=>{return isActive?'cursor-pointer p-3 text-black':'text-white cursor-pointer p-3'}}>view Donation history</NavLink> 
           
        </div>
        <div className='h-full w-9/12'>
            <Outlet/>
        </div>
    </div>
  )
}

export default Dashboarddonar