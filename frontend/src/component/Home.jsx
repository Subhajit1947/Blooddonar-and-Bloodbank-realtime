import React,{useState} from 'react'
import Login from './Login'
import { useNavigate } from 'react-router-dom'
import { soket } from '../App'
import { useSelector,useDispatch } from 'react-redux'
import { logoutr } from '../feature/authSlice'
function Home() {
  // const [data,setdata]=useState(null)
  //   const [token,settoken]=useState(()=>localStorage.getItem("refresh_token")?JSON.parse(localStorage.getItem("refresh_token")):null)
    const user=useSelector((state)=>state.user)
    const navigate=useNavigate()
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
  return (
    <div className=''>
      <div className='text-blue-500 text-3xl text-center'>welcome to our website</div>
      <div className='grid grid-cols-3 gap-10 mt-12'>
        <div className='h-40 border rounded-lg bg-black text-white text-center'>
          <h1>blood donetion camp</h1>
          <h4>city:kolkata</h4>

          <input type='button' value='register' className='w-20 cursor-pointer rounded bg-blue-500'/>

        </div>
        <div className='h-40 border rounded-lg bg-black text-white text-center'>
          <h1>blood donetion camp</h1>
          <h4>city:kolkata</h4>

          <input type='button' value='register' className='w-20 cursor-pointer rounded bg-blue-500'/>

        </div>
        <div className='h-40 border rounded-lg bg-black text-white text-center'>
          <h1>blood donetion camp</h1>
          <h4>city:kolkata</h4>

          <input type='button' value='register' className='w-20 cursor-pointer rounded bg-blue-500'/>

        </div>
        <div className='h-40 border rounded-lg bg-black text-white text-center'>
          <h1>blood donetion camp</h1>
          <h4>city:kolkata</h4>

          <input type='button' value='register' className='w-20 cursor-pointer rounded bg-blue-500'/>

        </div>
      </div>
    </div>
  )
}

export default Home