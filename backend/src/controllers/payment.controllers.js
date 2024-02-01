import Razorpay from 'razorpay'
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { Order } from '../model/order.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import mongoose from 'mongoose';
const instance = new Razorpay({
    key_id:process.env.RAZOR_PAY_KEY_ID,
    key_secret: process.env.RAZOR_PAY_SECRET_KEY,
});
const orderControllers=asyncHandler(async(req,res)=>{
    
    const {amount}=req.body
    const user_id=req.user._id
    // console.log(user._id)
    if(!amount){
        throw new ApiError(404,'amount not found')
    }
    if(!user_id){
        throw new ApiError(404,'user not found')
    }
    
    var options = {
    amount: amount,  // amount in the smallest currency unit
    currency: "INR",
    receipt: "order_rcptid_11"
    };
    
    try {
        instance.orders.create(options,async function(err, order) {
            console.log(order)
            const orderplace=await Order.create({order_id:order.id,amount,owner:user_id})
            if(!orderplace){
                throw new ApiError(500,'error in order model creation')
            }
            return res.status(201).json(
                new ApiResponse(200,order,'new order created')
            )
        });
    } catch (error) {
        throw new ApiError(500,error.message||"error in order creation")
    }
})
const ordersuccessControllers=asyncHandler(async(req,res)=>{
    const {order_id,payment_id,payment_signeture}=req.body
    if(!order_id){
        throw new ApiError(404,'order_id not found')
    }
    if(!payment_id){
        throw new ApiError(404,'payment_id not found')
    }
    if(!payment_signeture){
        throw new ApiError(404,'payment_signeture not found')
    }
    try {
        const orderreceive=await Order.findOneAndUpdate({order_id,owner:req.user._id},
            {
               $set:{payment_id:payment_id,payment_signeture:payment_signeture,status:"success"} 
            },
            {
                new:true
            })
        if(!orderreceive){
            throw new ApiError(500,'error in orderreceive')
        }
        
        return res.status(200).json(
            new ApiResponse(200,{},'payment successfull')
        )

    } catch (error) {
        throw new ApiError(500,error.meaasge||'error in orderreceive')
    }
})
const alldonationControllers=asyncHandler(async(req,res)=>{
    const user=req.user
    const checkadmin=req.user.isAdmin
    if(!(user||checkadmin)){
        throw new ApiError(400,'user not found')
    }
    try {
        if(checkadmin){
            const allpayment=await Order.aggregate([
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
                new ApiResponse(200,allpayment,'all payment details fetch')
            )
        }
        else{
            const allpayment=await Order.aggregate([
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
                new ApiResponse(200,allpayment,'all payment details fetch')
            )
        }
        
    } catch (error) {
        throw new ApiError(500,error.message||'error in fetching payment details')
    }
})
export {
    orderControllers,
    ordersuccessControllers,
    alldonationControllers
}
