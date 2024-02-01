import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { soket } from '../App'
const AvaliableBlood = () => {
    const [data,setdata]=useState([])
    const [token,settoken]=useState(()=>localStorage.getItem("refresh_token")?JSON.parse(localStorage.getItem("refresh_token")):null)
    const [ustatus,setustatus]=useState(false)
    useEffect(()=>{
        const headers={
            Authorization: 'Bearer ' + token 
        }
        axios.get('http://localhost:5000/api/blood-donar/avaliable',{headers}).then((res)=>{
            setdata(res.data.data)
        })
    },[token,ustatus])
    soket.on('statuschange',(uv)=>{
        ustatus==true?setustatus(false):setustatus(true)
      })
  return (
    <div className='flex p-8 justify-around flex-wrap'>
        {data?.map((bc)=>(
            <div className='h-40 w-40 bg-red-500 rounded-lg'>
                <div className='pl-4 pt-4 text-3xl text-white'>{bc._id}</div>
                <div className='pl-4 pt-4 text-xl text-green-800'><span>Avaliable count:</span><br/><span>{bc.count}</span></div>
            </div>
        ))}
        
        {/* <div className='h-40 w-40 bg-gray-100 rounded-lg'>
            <div className='pl-4 pt-4 text-3xl text-pink-800'>O+</div>
            <div className='pl-4 pt-4 text-xl text-green-800'><span>Avaliable count:</span><br/><span>30</span></div>
        </div>
        <div className='h-40 w-40 bg-gray-100 rounded-lg'>
            <div className='pl-4 pt-4 text-3xl text-pink-800'>O+</div>
            <div className='pl-4 pt-4 text-xl text-green-800'><span>Avaliable count:</span><br/><span>30</span></div>
        </div>
        <div className='h-40 w-40 bg-gray-100 rounded-lg'>
            <div className='pl-4 pt-4 text-3xl text-pink-800'>O+</div>
            <div className='pl-4 pt-4 text-xl text-green-800'><span>Avaliable count:</span><br/><span>30</span></div>
        </div> */}
    </div>
  )
}

export default AvaliableBlood