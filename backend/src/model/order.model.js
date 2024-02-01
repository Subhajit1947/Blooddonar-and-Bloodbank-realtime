import mongoose,{Schema} from "mongoose";

const orderSchema=new Schema(
    {
        order_id:{
            type:String
        },
        amount:{
            type:Number,
        },
        payment_id:{
            type:String
        },
        payment_signeture:{
            type:String
        },
        status:{
            type:String,
            enum:['pending','success'],
            default:'pending'
        },
        owner:{
            type:mongoose.Types.ObjectId,
            ref:'User'

        }
    },
    {timestamps:true}
)
export const Order=mongoose.model('Order',orderSchema)