import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { soket } from '../App'
import { useSelector,useDispatch } from 'react-redux'
import { logoutr } from '../feature/authSlice'
const RequestBlood = () => {
    const navigate=useNavigate()
    const user=useSelector((state)=>state.user)
    const dispatch=useDispatch()
    const [bgroup,setbgroup]=useState('O+')
    const [location,setlocation]=useState('kolkata')
    
    const handlerequest=()=>{
        const token=JSON.parse(localStorage.getItem('access_token'))
        const headers={
            Authorization: 'Bearer ' + token 
          }
        const d={
            bloodgroup:bgroup,location
        }
        axios.post('http://localhost:5000/api/blood-request',d,{headers}).then((res)=>{
            console.log(res)
            soket.emit('nbrcff','')
            navigate('/dashboard/request-history')
        })
    }
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
    <div className='h-full w-full flex justify-center items-center'>
        
        <div className='h-3/4 w-1/2 p-5 bg-gray-50 rounded-lg'>
            <div className='text-xl text-center text-pink-800 '>Request for Blood</div>
            <div className='h-1/6 w-full mt-8'>
                <label >choose blood type</label>
                <select id="mySelect" value={bgroup} onChange={(e)=>setbgroup(e.target.value)} className='h-4/6 w-5/6 '>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                </select>
            </div>
            <div className='h-1/6 w-full mt-8'>
                <label >Location</label><br/>
                <input type='text' value={location} onChange={(e)=>setlocation(e.target.value)} className='h-4/6 w-5/6 border-none'/>
            </div>
            
            <div className='h-1/6 w-full mt-8 text-center'>
                <input type='Button' value='Request' onClick={handlerequest} className='cursor-pointer h-4/6 w-5/6 bg-blue-600 text-white rounded-md'/>
            </div>
        </div>
        
    </div>
  )
}

export default RequestBlood

