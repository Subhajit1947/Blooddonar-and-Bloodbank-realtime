import React, { useState } from 'react'
import Signup from './Signup'

const AdminSignup = () => {
    const [admin,setadmin]=useState(true)
  return (
    <div>
        <Signup admin={admin}/>
    </div>
  )
}

export default AdminSignup