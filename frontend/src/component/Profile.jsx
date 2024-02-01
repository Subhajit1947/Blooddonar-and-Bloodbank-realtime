import React, { useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom'
import { soket } from '../App'
import { useSelector,useDispatch } from 'react-redux'
import { logoutr,loginfn } from '../feature/authSlice'
import axios from 'axios'
    
const Profile = () => {
    const [au,setau]=useState(false) 
    const [data,setdata]=useState(null)
    const user=useSelector((state)=>state.user)
    const navigate=useNavigate()
    const dispatch=useDispatch()
    const token=JSON.parse(localStorage.getItem('access_token'))
    
    soket.on('userdfb',(uid)=>{
      if(user._id.toString()===uid.toString()){
        console.log('uid match')
        localStorage.removeItem("access_token")
        localStorage.removeItem("refresh_token")
        localStorage.removeItem('user')
        dispatch(logoutr())
        navigate('/login')
      }
    })
    useEffect(()=>{
      const headers={
        Authorization: 'Bearer ' + token 
      }
      axios.get('http://localhost:5000/api/users/currentuser',{headers}).then((res)=>{
        setdata(res.data.data)
        dispatch(loginfn(res.data.data))
      })
    },[au])
    const handleupload=(file)=>{
      const headers={
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'multipart/form-data'
      }
      console.log(file)
      const formData = new FormData();
      formData.append('file', file);

      axios.put('http://localhost:5000/api/users/updateavater',formData,{headers}).then((r)=>{
        console.log(r)

        au==false?setau(true):setau(false)
      })
      
    }
    console.log(data)
  return (
    <div className="container w-screen px-4 py-8 flex justify-center">
      <div className="bg-white w-3/4 shadow-md rounded-lg overflow-hidden ">
        <div className="relative h-48  bg-gradient-to-r from-cyan-500 to-blue-500 items-center p-4 bg-gray-200">
            <div className='h-full w-32  flex items-center'>
              <img className='h-5/6 w-full rounded-full' src={data && data.avatar?data.avatar:`https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=612x612&w=0&k=20&c=dhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0=`}/>
            </div>
            <div className='h-14 w-14 absolute bottom-4 left-28'>
              <div className='h-full w-full relative'>
                <label for="fileInput" class="cursor-pointer">
                <img className='h-3/4 w-3/4 cursor-pointer' src='https://static-00.iconduck.com/assets.00/add-photo-camera-icon-2048x1842-pagj9gw6.png'/>
                </label>
                <input id='fileInput' onChange={(e)=>handleupload(e.target.files[0])} type='file' className='hidden absolute buttom-4 left-0  h-3/4 w-3/4' accept="image/*"/>
              </div>
            </div>
        </div>
        
        <div className="p-4">
          <h2 className="text-xl font-semibold text-gray-800">{user?.fullName}</h2>
          <p className="text-gray-600 mt-2">{user?.email}</p>
        </div>
        <div className="border-t border-gray-200">
          <div className="p-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Address</h3>
              <p className="mt-2 text-gray-600">{user?.address}</p>
            </div>
            
          </div>
        </div>
        <div className="border-t border-gray-200">
          <div className="p-4">
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Location</h3>
              <p className="mt-2 text-gray-600">{user?.city}</p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200">
          <div className="p-4 flex justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">phone</h3>
              <p className="mt-2 text-blue-600 ">{user?.phone}</p>
            </div>
            {/* <div>
              <h3 className="text-lg font-semibold text-gray-800">Joined</h3>
              <p className="mt-2 text-gray-600">user.joined</p>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile