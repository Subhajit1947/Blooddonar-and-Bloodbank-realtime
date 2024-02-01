import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {loginfn} from '../feature/authSlice'
import { useDispatch,useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
function Login() {
  const is_login=useSelector((state)=>state.islogin)
  const dispatch=useDispatch()
  const navigate=useNavigate()
    const [email,setemail]=useState('')
    
    const [password,setPassword]=useState('')
   
    const [err,seterr]=useState('')
    const spc=['@','#','$','%','*']
    useEffect(()=>{
        setTimeout(() => {
            seterr('')
        }, 2000);
    },[err])
    const handleLogin=()=>{
        
        if(!email.includes('@')){
            seterr('invalid email') 
        }
        
        
        else if(password.length<6 && spc.some((cha)=>password.includes(cha))){
            seterr('password len should be 6 and contain one special charecter') 
        }
        else{
          const d={
            email,password
          }
          axios.post("http://localhost:5000/api/users/login",d).then((res)=>{
            console.log("data is----",res.data.data)
            dispatch(loginfn(res.data.data.userres))
            localStorage.setItem('user',JSON.stringify(res.data.data.userres))
            localStorage.setItem('access_token',JSON.stringify(res.data.data.access_token))
            localStorage.setItem('refresh_token',JSON.stringify(res.data.data.refresh_token))
            navigate('/')
          }).catch((err)=>{
            seterr(err.message)
          })
        }
    }
    useEffect(()=>{
      if(is_login){
        navigate('/')
      }
    },[is_login])
    
  return (
    
    <div className='w-screen flex justify-around items-center'>
      <img className='h-full w-6/12 ' src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaK8IMo9VCjdlX_ZIIVGu2UNmg-rTNMKb73Q&usqp=CAU'/>
      <div className="h-full w-6/12 flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-full">
        <h2 className="text-2xl font-semibold mb-6">Login Form</h2>
        {err?
        <div className='bg-red-300 h-12'>
            {err}
        </div>
        :
        <></>}
        <form>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              email
            </label>
            <input
              className="border rounded w-full py-2 px-3"
              type="email"
              id="email"
              value={email}
              onChange={(e) => setemail(e.target.value)}
            />
          </div>
          
         
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="border rounded w-full py-2 px-3"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <button
            type="button"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
            onClick={handleLogin}
          >
            login
          </button>
        </form>
      </div>
    </div>
    </div>
    
  )
}

export default Login