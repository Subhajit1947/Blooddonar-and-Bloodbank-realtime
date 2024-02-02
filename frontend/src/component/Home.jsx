import React,{useEffect, useState} from 'react'
import Login from './Login'
import { Link, useNavigate } from 'react-router-dom'
import { soket } from '../App'
import { useSelector,useDispatch } from 'react-redux'
import { logoutr } from '../feature/authSlice'
import axios from 'axios'
function Home() {
  const [data,setdata]=useState(null)
    const [token,settoken]=useState(()=>localStorage.getItem("refresh_token")?JSON.parse(localStorage.getItem("refresh_token")):null)
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
    useEffect(()=>{
      axios.get('http://localhost:5000/api/event').then((res)=>{
        console.log(res.data.data)
        setdata(res.data.data)
      })
    },[])
    const handledelete=(id)=>{
      const headers={
        Authorization: 'Bearer ' + token 
      }
      axios.delete(`http://localhost:5000/api/event/deleteevent/${id}`,{headers}).then((res)=>{
      if(data){
        const narr=data.filter((ele)=>ele._id!=id)
        setdata([...narr])
      }  
      
      })
    }
  return (
    <div className=''>
      <div className='w-full text-blue-500 text-3xl text-center'> Our Current Event</div>
      <div className='mt-12 flex flex-wrap justify-around'>
        {data?.map((ele)=>(
          <div className="bg-gradient-to-r w-1/4 h-60 m-8 from-cyan-500 to-blue-500 rounded-lg shadow-md p-8">
            <h2 className="text-xl font-semibold mb-4">{ele.title}</h2>
            <p>Date: <span className="font-semibold">{ele.date}</span></p>
            <p>Time: <span className="font-semibold">{ele.time}</span></p>
            <p>Venue: <span className="font-semibold">{ele.vanue}</span></p>
            <p>Contact: <span className="font-semibold">{ele.contact}</span></p>
            
            {user?.isAdmin?
            <div className='text-center'>
            <button onClick={()=>handledelete(ele._id)} className='h-8 w-1/2 bg-red-700 rounded-md'>Delete</button>
            </div>:
            <div className='text-center'>
            {/* <button onClick={} className='h-8 w-1/2 bg-fuchsia-700 rounded-md'>Donate</button> */}
            {/* <Link to='/dashboard/donate'><button className='h-8 w-1/2 bg-fuchsia-700 rounded-md'>Donate</button></Link> */}
            </div>
            }
            
          </div>
        ))}
          
      </div>
    </div>
  )
}

export default Home