import React,{useState,useEffect} from 'react'
import axios from 'axios'
import { useSelector,useDispatch } from 'react-redux'
import { soket } from '../App'
import { logoutr } from '../feature/authSlice'
import { useNavigate } from 'react-router-dom'
const RequestHistory = () => {
  const navigate=useNavigate()
  const dispatch=useDispatch()
  const [data,setdata]=useState(null)
  const user=useSelector((state)=>state.user)
  const [token,settoken]=useState(()=>localStorage.getItem("refresh_token")?JSON.parse(localStorage.getItem("refresh_token")):null)
  const [urs,seturs]=useState(false)
  const [nbr,setnbr]=useState(false)
  const headers={
    Authorization: 'Bearer ' + token 
  }
  soket.on('ursb',(r)=>{
    urs==true?seturs(false):seturs(true)
  })
  soket.on('dbrb',(did)=>{
    if(data){
      const narr=data.filter((ele)=>ele._id.toString()!==did.toString())
      setdata([...narr])
    }
    
  })
  soket.on('nbrcfb',()=>{
    nbr==true?setnbr(false):setnbr(true)
  })
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
    axios.get('http://localhost:5000/api/blood-request/request-history',{headers}).then((res)=>{
      
      setdata(res.data.data)
    })
  },[token,urs,nbr])
  const handlechange=(status,id)=>{
    
    axios.put(`http://localhost:5000/api/blood-request/bloodreqstatus/${id}`,{status},{headers}).then(()=>{
      soket.emit('ursf',status)
    }).catch((err)=>{
      console.log(err.message)
    })
  }
  const handleDelete=(id)=>{
    axios.delete(`http://localhost:5000/api/blood-request/deletebloodreq/${id}`,{headers}).then((res)=>{
      console.log(res.data)
      soket.emit('dbrf',id)
    })
  }
  return (
    <div>
        <div className='text-center text-purple-600 text-2xl p-2 mt-4 bg-blue-300'>{user.isAdmin?'All Blood Request':'Your Blood Request History'} </div>
    <div className="overflow-x-auto mt-8">
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Address</th>
            <th className="px-4 py-2">Phone No</th>
            <th className="px-4 py-2">Blood Group</th>
            <th className="px-4 py-2">Location</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Delete</th>
          </tr>
        </thead>
        <tbody>
        {data?.map((donb)=>(
            <tr>
            <td className="border px-4 py-2">{donb.user_details.fullName}</td>
            <td className="border px-4 py-2">{donb.user_details.address}</td>
            <td className="border px-4 py-2">{donb.user_details.phone}</td>
            
            <td className="border px-4 py-2">{donb.bloodgroup}</td>
            <td className="border px-4 py-2">{donb.location}</td>
            <td className="border px-4 py-2">
            {user.isAdmin?
                
                <select onChange={(e)=>handlechange(e.target.value,donb._id)} className={donb.status=="pending"?'bg-yellow-200 cursor-pointer rounded p-1':donb.status=="accept"?'bg-green-500 cursor-pointer rounded p-1':'bg-red-500 cursor-pointer rounded p-1'} value={donb.status} >
                  <option value='accept'>accept</option>
                  <option value='reject'>reject</option>
                  <option value='pending'>pending</option>
                </select>
                
                :
                <input type='button' className={donb.status=="pending"?'bg-yellow-200 rounded p-1':donb.status=="accept"?'bg-green-500 rounded p-1':'bg-red-500 rounded p-1'} value={donb.status}/>
              }
            </td>
            <td className="border px-4 py-2">
              <input type='button' onClick={()=>handleDelete(donb._id)} className={'bg-red-500 rounded p-1 cursor-pointer'} value='Delete'/>
             
            </td>
          </tr>
          ))}
          {/* <tr>
            <td className="border px-4 py-2">Jane Smith</td>
            <td className="border px-4 py-2">25</td>
            <td className="border px-4 py-2">Canada</td>
            <td className="border px-4 py-2">Canada</td>
            <td className="border px-4 py-2">Canada</td>
            <td className="border px-4 py-2">
                <input type='button' className='bg-red-500 rounded p-1' value={'Rejected'}/>
            </td>
          </tr> */}
          {/* Add more rows as needed */}
        </tbody>
      </table>
    </div>
    </div>
  )
}

export default RequestHistory