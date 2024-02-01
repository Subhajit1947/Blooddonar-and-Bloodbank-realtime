import { User } from "../model/users.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken'
import {ApiError} from '../utils/ApiError.js'

const jwtVarify=asyncHandler(async(req,res,next)=>{
    const token=req.cookies?.access_token || req.headers.authorization?.replace('Bearer ','')
    if(!token){
        throw new ApiError(400,"token not found") 
    }
    try {
        const decodetoken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        const user=await User.findById(decodetoken._id).select('-password -refresh_token')
        if(!user){
            throw new ApiError(400,'invalid token')
        }
        req.user=user
        next()
    } catch (error) {
        throw new ApiError(400,error.message||'invalid token catch')
    }
})

export {jwtVarify}
