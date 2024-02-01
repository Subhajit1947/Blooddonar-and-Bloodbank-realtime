import {createSlice} from '@reduxjs/toolkit'


const user=JSON.parse(localStorage.getItem("user"))
const initialState=user?{islogin:true,
    user,}:{
    islogin:false,
    user:null
}
const authSlice=createSlice({
    name:'Auth',
    initialState,
    reducers:{
        loginfn:(state,action)=>{
            state.islogin=true,
            state.user=action.payload
        },
        logoutr:(state,action)=>{
            state.islogin=false,
            state.user=null
        }

    }
})

export const {loginfn,logoutr}=authSlice.actions
export default authSlice.reducer
