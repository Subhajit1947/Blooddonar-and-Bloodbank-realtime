import React,{useState,useEffect} from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { soket } from '../App'
const Alluser = () => {
    // const navigate=useNavigate()
    const [data,setdata]=useState(null)
    const [token,settoken]=useState(()=>localStorage.getItem("refresh_token")?JSON.parse(localStorage.getItem("refresh_token")):null)
    const user=useSelector((state)=>state.user)
    // const [status,setstatus]=useState('pending')
    const headers={
      Authorization: 'Bearer ' + token 
    }
    useEffect(()=>{
      
      console.log("inside useeffect")
      
      axios.get('http://localhost:5000/api/users/admin',{headers}).then((res)=>{
        
        setdata(res.data.data)
      })
    },[token])
    const handleDelete=(id)=>{
      axios.delete(`http://localhost:5000/api/users/admin/deleteuser/${id}`,{headers}).then(()=>{
        soket.emit('userdfr',id)
        if(data){
          const narr=data.filter((ele)=>ele._id.toString()!==id.toString())
          setdata([...narr])
        }
        
      })
    }
  return (
    <div>
        <div className='text-center text-purple-600 text-2xl p-2 mt-4 bg-blue-300'>{user.isAdmin?'All Donar Request':'Your Blood Donation History'} </div>
        <div className="overflow-x-auto mt-8">
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Address</th>
            <th className="px-4 py-2">Phone No</th>
            <th className="px-4 py-2">City</th>
            <th className="px-4 py-2">Delete user</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((donb)=>(
            <tr>
            <td className="border px-4 py-2">{donb?.fullName}</td>
            <td className="border px-4 py-2">{donb?.address}</td>
            <td className="border px-4 py-2">{donb?.phone}</td>
            <td className="border px-4 py-2">{donb?.city}</td>
            
            
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

export default Alluser