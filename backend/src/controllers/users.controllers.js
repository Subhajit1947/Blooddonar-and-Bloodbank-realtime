import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../model/users.model.js";
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import jwt from 'jsonwebtoken'
import { Bloodbank } from "../model/bloodbank.model.js";
import { Bloodrequest } from "../model/bllodrequest.model.js";
import { Order } from "../model/order.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


const options={
    httpOnly:true,
    secure:true
}

const generateAccessRefreshToken=async(userId)=>{
    try {
        const user=await User.findById(userId)
        const access_token=await user.generateAccessToken()
        const refresh_token=await user.generateRefeshToken()
        user.refresh_token=refresh_token
        user.save({validateBeforeSave:false})
        return {access_token,refresh_token}
    } catch (error) {
        throw new ApiError(500,error.message || "error when tokensgenerate")
    }
}


const registerController=asyncHandler(async(req,res)=>{
    const {email,fullName,phone,address,password,city,isAdmin=false}=req.body
    if(
        [email,fullName,phone,address,password,city].some((ele)=>ele?.trim()==='')
    ){
        throw new ApiError(400,"all fields are required")
    }
    const existUser=await User.findOne({
        $or:[{phone},{email}]
    })
    if(existUser){
        throw new ApiError(409,"user already exist")
    }
    try {
        const user=await User.create({email,fullName,phone,address,password,city,isAdmin})
        const createduser=await User.findById(user._id).select("-password -refresh_token")
        if(!createduser){
            throw new ApiError(500,"somthing went to wrong while registering")
        }
        return res.status(201).json(
            new ApiResponse(200,createduser,"user register successfully")
        )
    } catch (error) {
        throw new ApiError(500,error.message)
        
    }
})

const loginController=asyncHandler(async(req,res)=>{
    const {email,phone,password}=req.body
    if(!email && !phone){
       throw new ApiError(400,"email or phone not found") 
    }
    if(!password){
        throw new ApiError(400,"password not found")
    }
    try {
        const user=await User.findOne({
            $or:[{phone},{email}]
        })
        if(!user){
            throw new ApiError(400,"user not found")
        }
        const passwordCheck=await user.isPasswordCorrect(password)
        if(!passwordCheck){
            throw new ApiError(400,"invaild password")
        }
        const {refresh_token,access_token}=await generateAccessRefreshToken(user._id)
        if(!access_token){
            throw new ApiError(500,"access token not generate")
        }
        if(!refresh_token){
            throw new ApiError(500,"refesh token not generate")
        }
        const userres=await User.findById(user._id).select('-password -refresh_token')
        return res.status(200)
            .cookie("access_token",access_token,options)
            .cookie("refresh_token",refresh_token,options)
            .json(
                new ApiResponse(200,{userres,access_token,refresh_token},'loginsuccessfull')
            )
    } catch (error) {
        throw new ApiError(500,error.message||"err in loginfn")
    }
})

const logoutController=asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(req.user._id,
        {
            $set:{refresh_token:null}
        },
        {
            new:true
        }
    )
    return res.status(200)
        .clearCookie("access_token",options)
        .clearCookie("refresh_token",options)
        .json(
            new ApiResponse(200,{},"logout successfull")
        )

})

const refresh_token_endpoint=asyncHandler(async(req,res)=>{
    const incoming_refresh_token=req.cookies.refresh_token || req.body.refresh_token
    if(!incoming_refresh_token){
        throw new ApiError(400,'invaid refreshtoken')
    }
    
    try {
        const decodeToken=jwt.verify(incoming_refresh_token,process.env.REFESH_TOKEN_SECRET)
        
        const user=await User.findById(decodeToken._id)
        
        if(!user){
            throw new ApiError(400,'invalid token') 
        }
        if(incoming_refresh_token!==user.refresh_token){
            throw new ApiError(400,'token unmatched')
        }
        const {access_token,refresh_token}=await generateAccessRefreshToken(user._id)
        user.refresh_token=refresh_token
        user.save({validateBeforeSave:false})
        return res.status(200)
            .cookie("access_token",access_token,options)
            .cookie("refresh_token",refresh_token,options)
            .json(
                new ApiResponse(200,{access_token,refresh_token},"token refreshed")
            )

    } catch (error) {
        throw new ApiError(400,error.message||'error related to token')
    }
})
const getCurrentUser=asyncHandler(async(req,res)=>{
    const user=req.user
    
    try {
        const u=await User.findById(user._id).select('-password -refresh_token')
        return res.status(200)
            .json(
                new ApiResponse(200,u,"current user")
            )
    } catch (error) {
        throw new ApiError(500,error.message||'error in fetch user')
    }

})

const uploadprofileimageControllers=asyncHandler(async(req,res)=>{
    const avaterlocalpath=req.file?.path
    if(!avaterlocalpath){
        throw new ApiError(400,"please upload file")
    }
    try {
        const rescloud=await uploadOnCloudinary(avaterlocalpath)
        if(!rescloud){
            throw new ApiError(400,'no res from cloudinary')
        }
        try {
            await User.findByIdAndUpdate(req.user._id,
                {
                    $set:{avatar:rescloud.url}
                },
                {
                    new:true
                }
            )
            return res.status(200).json(
                new ApiResponse(200,{},"avater change successfully")
            )
            
        } catch (error) {
            throw new ApiError(400,"user not found please lognin")
        }
    } catch (error) {
        throw new ApiError(400,"upload issue")
    }
})


const alluserControllers=asyncHandler(async(req,res)=>{
    const checkadmin=req.user.isAdmin
    if(!checkadmin){
        throw new ApiError(300,'you are not authorize')
    }
    try {
        const alluser=await User.find().select('-password -refresh_token')
        return res.status(200).json(
            new ApiResponse(200,alluser,'all user fetch')
        )
    } catch (error) {
        throw new ApiError(300,error.message||'error in fetch alluser')
    }
})
const deleteuserControllers=asyncHandler(async(req,res)=>{
    const checkadmin=req.user.isAdmin
    const {id}=req.params
    if(!checkadmin){
        throw new ApiError(300,'you are not authorize')
    }
    if(!id){
        throw new ApiError(400,'id not found')
    }
    try {
        const user=await User.findByIdAndDelete({_id:id})
        await Bloodbank.deleteMany({owner:id})
        await Bloodrequest.deleteMany({owner:id})
        await Order.deleteMany({owner:id})
        if(!user){
            throw new ApiError(500,'error in delete user')
        }
        return res.status(200).json(
            new ApiResponse(200,{},' user delete successfully')
        )
    } catch (error) {
        throw new ApiError(300,error.message||'error in delete user')
    }
})
export {
    registerController,
    loginController,
    logoutController,
    refresh_token_endpoint,
    getCurrentUser,
    alluserControllers,
    deleteuserControllers,
    uploadprofileimageControllers

}

