import React, { useState,useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { soket } from '../App'
import { useSelector,useDispatch } from 'react-redux'
import { logoutr } from '../feature/authSlice'
const PaymentHistory = () => {
    const [data,setdata]=useState(null)
    const [ts,setts]=useState(false)
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
    soket.on('tsfb',()=>{
      ts==true?setts(false):setts(true)
    })
    useEffect(()=>{
        
        
        const headers={
            Authorization: 'Bearer ' + token 
        }
        axios.get('http://localhost:5000/api/order/paymenthistory',{headers}).then((res)=>{
            console.log(res.data.data)
            setdata(res.data.data)
        })
    },[token,ts])

  return (
    <div>
        <div className='text-center text-purple-600 text-2xl p-2 mt-4 bg-blue-300'>{user?.isAdmin?'All transition History':'Your transition History'}</div>
    <div className="overflow-x-auto mt-8">
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Address</th>
            <th className="px-4 py-2">Phone No</th>
            <th className="px-4 py-2">Amount Paid</th>
            <th className="px-4 py-2">order_id</th>
            <th className="px-4 py-2">payment_id</th>
            <th className="px-4 py-2">payment_signeture</th>
            <th className="px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
        {data?.map((donb)=>(
            <tr>
            <td className="border px-4 py-2">{donb.user_details.fullName}</td>
            <td className="border px-4 py-2">{donb.user_details.address}</td>
            <td className="border px-4 py-2">{donb.user_details.phone}</td>
            
            <td className="border px-4 py-2">{donb.amount}</td>
            <td className="border px-4 py-2">{donb.order_id}</td>
            <td className="border px-4 py-2">{donb.payment_id}</td>
            <td className="border px-4 py-2">{donb.payment_signeture}</td>
            <td className="border px-4 py-2">
                <input type='button' className={donb.status=="pending"?'bg-yellow-200 rounded p-1':'bg-green-500 rounded p-1'} value={donb.status}/>
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

export default PaymentHistory