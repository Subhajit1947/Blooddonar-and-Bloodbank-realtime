import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {Bloodbank} from '../model/bloodbank.model.js'
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";


const avaliablebankControllers=asyncHandler(async(req,res)=>{
    
    try {
        const bcount=await Bloodbank.aggregate([
            {
                $match:{
                    status:"accept"
                }
            },
            {
                $group:{
                    _id:"$bloodgroup",
                    count:{$sum:1}
                }
            }
        ])
        return res.status(200).json(
            new ApiResponse(200,bcount,'all bank fetch')
        )
    } catch (error) {
       throw new ApiError(400,error.message) 
    }
})
const donateControllers=asyncHandler(async(req,res)=>{
    const {bloodgroup,price='free',disease='none'}=req.body
    const user=req.user
    if(!bloodgroup){
        throw new ApiError(404,'blood group not found')
    }
    if(!user){
        throw new ApiError(404,'user not found')
    }
    try {
        const donateblood=await Bloodbank.create({bloodgroup,price,disease,owner:user._id})
        if(!donateblood){
            throw new ApiError(404,'error in donateblood creation') 
        }
        return res.status(201).json(
            new ApiResponse(200,donateblood,'new donation created')
        )
    } catch (error) {
        throw new ApiError(404,error.message||'error in donateblood creation')
    }
})

const donarHistoryControllers=asyncHandler(async(req,res)=>{
    const user=req.user
    if(!user){
        throw new ApiError(400,'user not found')
    }
    try {
        if(user.isAdmin){
            const requesthistory=await Bloodbank.aggregate([
                {
                    $lookup:{
                        from:"users",
                        localField:"owner",
                        foreignField:"_id",
                        as:"user_details",
                        pipeline:[
                            {
                                $project:{
                                    
                                    fullName:1,
                                    address:1,
                                    city:1,
                                    phone:1
                                }
                            }
                        ]
                    }
                },
                {
                    $addFields:{
                        user_details:{$first:"$user_details"}
                    }
                }
            ])
            return res.status(200).json(
                new ApiResponse(200,requesthistory,"requesthistory fetch successfuly")
            )
        }
        else{
            const requesthistory=await Bloodbank.aggregate([
                {
                    $match:{
                        owner:new mongoose.Types.ObjectId(user._id),
                        
                    }
                },
                {
                    $lookup:{
                        from:"users",
                        localField:"owner",
                        foreignField:"_id",
                        as:"user_details",
                        pipeline:[
                            {
                                $project:{
                                    
                                    fullName:1,
                                    address:1,
                                    city:1,
                                    phone:1
                                }
                            }
                        ]
                    }
                },
                {
                    $addFields:{
                        user_details:{$first:"$user_details"}
                    }
                }
            ])
            return res.status(200).json(
                new ApiResponse(200,requesthistory,"requesthistory fetch successfuly")
            )
        }
        
    } catch (error) {
        throw new ApiError(500,error.message||'error in fetching donarhistory') 
    }
})

// admin panel
const acceptrejectpendingDonarRequest=asyncHandler(async(req,res)=>{
    
    const checkadmin=req.user.isAdmin
    const {id}=req.params
    const {status}=req.body
    if(!checkadmin){
        throw new ApiError(300,'you are not authorize')
    }
    if(!id){
        throw new ApiError(400,'id not found')
    }
    
    try {
        const udonar=await Bloodbank.findByIdAndUpdate({_id:id},
            {
                $set:{status}
            },
            {
                new:true
            }
        )
        if(!udonar){
            throw new ApiError(500,'err in update donar')
        }
        return res.status(200).json(
            new ApiResponse(200,{},'donar status update successfully')
        )
    } catch (error) {
        throw new ApiError(400,error.message||'err in update donar 11')
    }
})
const deletDonarRequestConrollers=asyncHandler(async(req,res)=>{
    const checkadmin=req.user.isAdmin
    const user_id=req.user._id
    const {id}=req.params
    if(!user_id){
        throw new ApiError(300,'you are not authorize')
    }
    if(!id){
        throw new ApiError(400,'id not found')
    }
    try {
        const donerreq=await Bloodbank.findById({_id:id})
        
        if(!(checkadmin||donerreq.owner.toString()===user_id.toString())){
            throw new ApiError(300,'you are not authorize')
        }
        await Bloodbank.findByIdAndDelete({_id:id})
        return res.status(200).json(
            new ApiResponse(200,{},'doner req delete successfully')
        )
    } catch (error) {
        throw new ApiError(500,error.message||'error in delete donar req')
    }
})

export {
    donateControllers,
    avaliablebankControllers,
    donarHistoryControllers,
    acceptrejectpendingDonarRequest,
    deletDonarRequestConrollers
}