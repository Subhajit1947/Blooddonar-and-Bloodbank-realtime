import Home from "./component/Home"
import Navbar from "./component/Navbar"
import Signup from "./component/Signup"
import {Route, RouterProvider,createBrowserRouter, createRoutesFromElements} from 'react-router-dom'
import Layout from "./component/Layout"
import Login from "./component/Login"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import axios from "axios"
import Dashboarddonar from "./component/Dashboarddonar"
import DonateBlood from "./component/DonateBlood"
import RequestBlood from "./component/RequestBlood"
import DonarHistory from "./component/DonarHistory"
import RequestHistory from "./component/RequestHistory"
import Profile from "./component/Profile"
import AvaliableBlood from "./component/AvaliableBlood"
import Donatemoney from './component/Donatemoney'
import PaymentHistory from "./component/PaymentHistory"
import AdminSignup from "./component/AdminSignup"
import Alluser from "./component/Alluser"
import { useDispatch } from "react-redux"
import {loginfn,logoutr} from './feature/authSlice'
import { io } from "socket.io-client"
import Createevent from "./component/Createevent"
const soket=io('http://localhost:5000')
function App() {
  const is_login=useSelector((state)=>state.islogin)
  const user=useSelector((state)=>state.user)
  const dispatch=useDispatch()
  const [token,settoken]=useState(()=>localStorage.getItem("refresh_token")?JSON.parse(localStorage.getItem("refresh_token")):null)
  const [atoken,setatoken]=useState(()=>localStorage.getItem("access_token")?JSON.parse(localStorage.getItem("access_token")):null)
  const headers={
    Authorization: 'Bearer ' + atoken 
  }
  useEffect(()=>{
    if(is_login){
      settoken(JSON.parse(localStorage.getItem("refresh_token")))
      setatoken(JSON.parse(localStorage.getItem("access_token")))
    }
    else{
      settoken(null)
      setatoken(null)
    }
    let interval=setInterval(() => {
      if(token){
        console.log('update token called')
        axios.post('http://localhost:5000/api/users/refresh',{refresh_token:token}).then((res)=>{
          console.log(res.data.data.refresh_token)
          settoken(res.data.data.refresh_token)
          localStorage.setItem('access_token',JSON.stringify(res.data.data.access_token))
          localStorage.setItem('refresh_token',JSON.stringify(res.data.data.refresh_token))
        }).catch(()=>{
          localStorage.removeItem("access_token")
          localStorage.removeItem("refresh_token")
          localStorage.removeItem('user')
          dispatch(logoutr())
          window.location.reload();
          navigate('/login')
        })
      }
      
    },1000*30*60);
    return ()=>clearInterval(interval)
    
    
    
  },[token,is_login])

  // useEffect(()=>{
  //   if(token){
  //     axios.get('http://localhost:5000/api/users/currentuser',{headers}).then((res)=>{
  //     console.log(res.data.data)
  //     dispatch(loginfn(res.data.data))
  //   }).catch((err)=>{
  //     localStorage.removeItem("access_token")
  //     localStorage.removeItem("refresh_token")
  //     localStorage.removeItem('user')
  //     dispatch(logoutr())
  //     window.location.reload();
  //     navigate('/login')
  //   })
  //   }
    
  // },[token])
  
  


  const router=createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout t={atoken}/>}>
        <Route path='dashboard' element={<Dashboarddonar/>}>
          <Route path='donate' element={<DonateBlood/>}/>
          <Route path='blood-request' element={<RequestBlood/>}/>
          <Route path='donar-history' element={<DonarHistory/>}/>
          <Route path='request-history' element={<RequestHistory/>}/>
          <Route path='alluser' element={<Alluser/>}/>
          <Route path='createevent' element={<Createevent/>}/>

          
        </Route>
        <Route path="" element={<Home/>}/>
        <Route path='profile' element={<Profile/>}/>
        <Route path='donate' element={<Donatemoney/>}/>
        <Route path="avaliable" element={<AvaliableBlood/>}/>
        <Route path="paymenthistory" element={<PaymentHistory/>}/>
        
        <Route path="adminsignup" element={<AdminSignup/>}/>

        <Route path="login" element={<Login/>}/>
        <Route path="signup" element={<Signup/>}/>

      </Route>
    )
  )
  return (
    <>
      <RouterProvider router={router}/>
      
    </>
  )
}

export {soket}
export default App
