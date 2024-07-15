
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector} from 'react-redux'
import axios from 'axios'
import {logoutr} from '../feature/authSlice'

import { soket } from '../App'

export default function Navbar({t}) {
  // const [token,settoken]=useState(()=>localStorage.getItem("access_token")?JSON.parse(localStorage.getItem("access_token")):null)
  const is_login=useSelector((state)=>state.islogin)
  const user=useSelector((state)=>state.user)
  const dispatch=useDispatch()
  const navigate=useNavigate()
  const logoutfn=()=>{
    const headers={
      Authorization: 'Bearer ' + t 
    }
    axios.put('http://localhost:5000/api/users/logout',{},{headers}).then((res)=>{
      console.log(res)
      localStorage.removeItem("access_token")
      localStorage.removeItem("refresh_token")
      localStorage.removeItem('user')
      dispatch(logoutr())
      navigate('/')
    
    })
     
    
    
  }
  
  return (
    <div className='sticky top-0 h-16 w-full bg-black grid grid-cols-2'>
      <div className='h-full text-white flex  items-center grid grid-cols-4 '>
        <NavLink to='/' className={({isActive})=>{return isActive?'text-center text-blue-600':'text-white text-center'}} >Home</NavLink>
        {is_login?
         <>
        <NavLink className={({isActive})=>{return isActive?'text-center text-blue-600':'text-white text-center'}} to='/dashboard/donar-history'>{user.isAdmin?'Admin DashBoard':'DashBoard'}</NavLink>
        <NavLink className={({isActive})=>{return isActive?'text-center text-blue-600':'text-white text-center'}} to='/avaliable'> Blood avaliable</NavLink>
        <NavLink className={({isActive})=>{return isActive?'text-center text-blue-600':'text-white text-center'}} to='/donate'> Donate Money</NavLink>
        
        </> :<>
        <Link></Link>
        <Link></Link>
        <Link></Link></>}
        
      </div>
      <div className='h-full text-white flex items-center grid grid-cols-4 '>
        {is_login?
          <>
        <NavLink></NavLink>
        
        
        <NavLink className={({isActive})=>{return isActive?'text-center text-blue-600':'text-white text-center'}} to='/paymenthistory'> Payment History</NavLink>
        
        <NavLink className={({isActive})=>{return isActive?'text-center text-blue-600':'text-white text-center'}} to='/profile'>
            <div className='h-5/6  w-full  flex  items-center'>
              <img className='h-full w-12 rounded-full' src={user && user.avatar?user.avatar:`https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=612x612&w=0&k=20&c=dhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0=`}/>
            </div>
        </NavLink>
        <NavLink onClick={logoutfn}>logout</NavLink>
        </>:<>
        <Link></Link>
        
        
{/*         <NavLink className={({isActive})=>{return isActive?'text-center text-blue-600':'text-white text-center'}} to='/adminsignup' >Adminsignup</NavLink> */}
        <NavLink className={({isActive})=>{return isActive?'text-center text-blue-600':'text-white text-center'}} to='/signup' >signup</NavLink>
        <NavLink className={({isActive})=>{return isActive?'text-center text-blue-600':'text-white text-center'}} to='/login'>Login</NavLink>
        </>}
      </div>

    </div>
  )
}
