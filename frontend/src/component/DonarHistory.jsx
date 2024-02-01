import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { soket } from '../App'
const DonarHistory = () => {
    
    const navigate=useNavigate()
    const [data,setdata]=useState(null)
    const [token,settoken]=useState(()=>localStorage.getItem("refresh_token")?JSON.parse(localStorage.getItem("refresh_token")):null)
    const user=useSelector((state)=>state.user)
    const [ustatus,setustatus]=useState(false)
    const [dc,setdc]=useState(false)
    // const [status,setstatus]=useState('pending')
    const headers={
      Authorization: 'Bearer ' + token 
    }
    soket.on('statuschange',(uv)=>{
      ustatus==true?setustatus(false):setustatus(true)
    })
    soket.on('ddonarb',(d)=>{
      if(data){
        const narr=data.filter((ele)=>ele._id.toString()!==d.toString())
        setdata([...narr])
      }
    })
    soket.on('dcfb',()=>{
      dc==true?setdc(false):setdc(true)
    })
    useEffect(()=>{
      
      console.log("inside useeffect")
      
      axios.get('http://localhost:5000/api/blood-donar/donar-history',{headers}).then((res)=>{
        console.log(res.data.data)
        setdata(res.data.data)
      })
    },[token,ustatus,dc])
    const handlechange=(status,id)=>{
      
      axios.put(`http://localhost:5000/api/blood-donar/donarstatus/${id}`,{status},{headers}).then(()=>{
        soket.emit('update_status',status)
       
      })
    }
    const handleDelete=(id)=>{
      axios.delete(`http://localhost:5000/api/blood-donar/deletedonarreq/${id}`,{headers}).then(()=>{
        soket.emit('ddonarf',id)
      })
    }
    
    return (
        <div>
        <div className='text-center text-purple-600 text-2xl p-2 mt-4 bg-blue-300'>{user?.isAdmin?'All Donar Request':'Your Blood Donation History'} </div>
        <div className="overflow-x-auto mt-8">
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Address</th>
            <th className="px-4 py-2">Phone No</th>
            <th className="px-4 py-2">Disease</th>
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
            <td className="border px-4 py-2">{donb.disease}</td>
            <td className="border px-4 py-2">{donb.bloodgroup}</td>
            <td className="border px-4 py-2">{donb.user_details.city}</td>
            <td className="border px-4 py-2 flex flex-col">
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

export default DonarHistory