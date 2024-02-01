import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {Bloodrequest} from "../model/bllodrequest.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
const requestControllers=asyncHandler(async(req,res)=>{
    const {bloodgroup,location='kolkata'}=req.body
    const user=req.user
    if(!bloodgroup){
        throw new ApiError(400,'bloodgroup not found')
    }
    if(!user){
        throw new ApiError(400,'user not found')
    }
    try {
        
        const accepter=await Bloodrequest.create({bloodgroup,location,owner:user._id})
        return res.status(201).json(
            new ApiResponse(200,accepter,'new doner created')
        )
    } catch (error) {
        throw new ApiError(500,error.message||'error in creation of blood request')
    }
})

const requestHistoryControllers=asyncHandler(async(req,res)=>{
    const user=req.user
    if(!user){
        throw new ApiError(400,'user not found') 
    }
    try {
        if(user.isAdmin){
            const requesthistory=await Bloodrequest.aggregate([
                
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
            const requesthistory=await Bloodrequest.aggregate([
                {
                    $match:{
                        owner:new mongoose.Types.ObjectId(user._id)
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
        
    }
})

const acceptrejectpendingBloodRequest=asyncHandler(async(req,res)=>{
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
        const udonar=await Bloodrequest.findByIdAndUpdate({_id:id},
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
const deletBloodRequestConrollers=asyncHandler(async(req,res)=>{
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
        const donerreq=await Bloodrequest.findById({_id:id})
        if(!(checkadmin||donerreq.owner.toString()===user_id.toString())){
            throw new ApiError(300,'you are not authorize')
        }
        await Bloodrequest.findByIdAndDelete({_id:id})
        return res.status(200).json(
            new ApiResponse(200,{},'blood req delete successfully')
        )
    } catch (error) {
        throw new ApiError(500,error.message||'error in delete Blood req')
    }
})

export {
    requestControllers,
    requestHistoryControllers,
    deletBloodRequestConrollers,
    acceptrejectpendingBloodRequest
}