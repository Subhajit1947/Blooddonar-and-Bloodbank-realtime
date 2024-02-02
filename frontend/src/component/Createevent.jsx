
import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { soket } from '../App'
import { useSelector,useDispatch } from 'react-redux'
import { logoutr } from '../feature/authSlice'
const Createevent = () => {
    const navigate=useNavigate()
    const [title,settitle]=useState('')
    const [date,setdate]=useState('')
    const [time,settime]=useState('')
    const [vanue,setvanue]=useState('')
    const [contact,setcontact]=useState('')




    const [token,settoken]=useState(()=>localStorage.getItem("refresh_token")?JSON.parse(localStorage.getItem("refresh_token")):null)
    const user=useSelector((state)=>state.user)
    
    const dispatch=useDispatch()
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
    const handledonate=()=>{
        if(user.isAdmin){
            const t=JSON.parse(localStorage.getItem('access_token'))
            const headers={
                Authorization: 'Bearer ' + t 
            }
            const d={
                date,time,title,vanue,contactno:contact
            }
            axios.post('http://localhost:5000/api/event/createevent',d,{headers}).then((res)=>{
                console.log(res)
                
                navigate('/')
            })
        }
        
    }
    if(!user.isAdmin){
        navigate('/')
    }
  return (
    <div className='h-full w-full flex justify-center items-center'>
        <div className=' w-1/2 p-5 bg-gray-50 rounded-lg'>
            <div className='text-xl text-center text-pink-800 '>Create Event</div>
            <div className='h-1/6 w-full mt-8'>
                <label >Title</label><br/>
                <input type='text' value={title} onChange={(e)=>settitle(e.target.value)} required className='h-4/6 w-5/6 border-none'/>
            </div>
            <div className='h-1/6 w-full mt-8'>
                <label >Date</label><br/>
                <input type='text' value={date} onChange={(e)=>setdate(e.target.value)} required className='h-4/6 w-5/6 border-none'/>
            </div>
            <div className='h-1/6 w-full mt-8'>
                <label >Time</label><br/>
                <input type='text' value={time} onChange={(e)=>settime(e.target.value)} required className='h-4/6 w-5/6 border-none'/>
            </div>
            <div className='h-1/6 w-full mt-8'>
                <label >Vanue</label><br/>
                <input type='text' value={vanue} onChange={(e)=>setvanue(e.target.value)} required className='h-4/6 w-5/6 border-none'/>
            </div>
            <div className='h-1/6 w-full mt-8'>
                <label >Contact no</label><br/>
                <input type='text' value={contact} onChange={(e)=>setcontact(e.target.value)} required className='h-4/6 w-5/6 border-none'/>
            </div>
            
            <div className='h-1/6 w-full mt-8 text-center'>
                <input type='button' value='Create' onClick={handledonate} required className='cursor-pointer h-4/6 w-5/6 bg-blue-600 text-white rounded-md'/>
            </div>
        </div>
        
    </div>
  )
}

export default Createevent