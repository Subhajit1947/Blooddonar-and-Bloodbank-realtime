import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useSelector } from 'react-redux'
function Signup({admin=false}) {
    const is_login=useSelector((state)=>state.islogin)
    console.log('signupppppp',is_login)
    const navigate=useNavigate()
    useEffect(()=>{
      if(is_login){
        navigate('/')
      }
    },[is_login])
    const [name,setName]=useState('')
    const [email,setemail]=useState('')
    const [add,setadd]=useState('')
    const [city,setcity]=useState('')
    const [password,setPassword]=useState('')
    const [phone,setphone]=useState('')
    const [err,seterr]=useState('')
    const spc=['@','#','$','%','*']
    useEffect(()=>{
        setTimeout(() => {
            seterr('')
        }, 2000);
    },[err])
    const handleSignup=()=>{
        if(name.length<3){
            seterr('name is too short')
        }
        else if(!email.includes('@')){
            seterr('invalid email') 
        }
        else if(phone.length!=10){
            seterr('invalid phone no')
        }
        else if(!add){
            seterr('address is required') 
        }
        else if(!city){
            seterr('city is required') 
        }
        else if(password.length<6 && spc.some((cha)=>password.includes(cha))){
            seterr('password len should be 6 and contain one special charecter') 
        }
        else{
          const d={
            fullName:name,email,phone,password,address:add,city
          }
          if(admin){
            d['isAdmin']=true
          }
          
          console.log(d)
          axios.post("http://localhost:5000/api/users/register",d).then((res)=>{
            console.log("data is----",res)
            navigate('/login')
          })
        }
    }
    
  return (
    <div className='w-screen flex justify-around items-center'>
      <img className='h-full w-6/12 ' src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaK8IMo9VCjdlX_ZIIVGu2UNmg-rTNMKb73Q&usqp=CAU'/>
      <div className="h-full w-6/12 flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-full">
        <h2 className="text-2xl font-semibold mb-6">{admin?'Admin signup page':'Signup Form'}</h2>
        {err?
        <div className='bg-red-300 h-12'>
            {err}
        </div>
        :
        <></>}
        <form>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              Name
            </label>
            <input
              className="border rounded w-full py-2 px-3"
              type="text"
              id="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
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
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              Address
            </label>
            <input
              className="border rounded w-full py-2 px-3"
              type="text"
              id="address"
              value={add}
              onChange={(e) => setadd(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              City
            </label>
            <input
              className="border rounded w-full py-2 px-3"
              type="text"
              id="city"
              value={city}
              onChange={(e) => setcity(e.target.value)}
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
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Mobile
            </label>
            <input
              className="border rounded w-full py-2 px-3"
              type="text"
              id="phone"
              value={phone}
              onChange={(e) => setphone(e.target.value)}
            />
          </div>
          <button
            type="button"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
            onClick={handleSignup}
          >
            Signup
          </button>
        </form>
      </div>
    </div>
    </div>
  )
}

export default Signup