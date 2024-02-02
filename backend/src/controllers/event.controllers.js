import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from '../utils/ApiError.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import { Event } from '../model/events.model.js'
const createeventControllers=asyncHandler(async(req,res)=>{
    const admin=req.user?.isAdmin
    const {date,time,title,vanue,contactno}=req.body

    console.log(date,time,title,vanue,contactno)
    if(!admin){
        throw new ApiError(300,'you are not authorize')
    }
    if([date,time,title,vanue,contactno].some((ele)=>ele?.trim()==='')){
        throw new ApiError(404,'all reqired')
    }
    try {
        const nevent=await Event.create({date,time,title,vanue,contactno,owner:req.user._id})
        return res.status(201).json(
            new ApiResponse(200,nevent,'new event created successfully')
        )
    } catch (error) {
        throw new ApiError(500,error.message||'error in createtion event')
    }
})
const fetchalleventControllers=asyncHandler(async(req,res)=>{
    try {
        const allevent=await Event.find()
        return res.status(200).json(
            new ApiResponse(200,allevent,'all event fetch')
        )
    } catch (error) {
        throw new ApiError(500,'error in fetch all event')
    }
}) 
const deleteeventControlers=asyncHandler(async(req,res)=>{
    const {eid}=req.params
    const admin=req.user.isAdmin
    if(!admin){
        throw new ApiError(300,'you are not authorize')
    }
    if(!eid){
        throw new ApiError(404,'id not found')
    }
    try {
        const de=await Event.findByIdAndDelete({_id:eid})
        return res.status(200).json(
            new ApiResponse(200,{},'delete successfully')
        )
    } catch (error) {
        
    }
}) 
export {
    createeventControllers,
    fetchalleventControllers,
    deleteeventControlers
}
