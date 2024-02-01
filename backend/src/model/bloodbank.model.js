import mongoose,{Schema} from "mongoose";

const bloodbankSchema=new Schema(
    {
        bloodgroup:{
            type:String,
            uppercase:true,
            enum:['O+','O-','A+','AB+','AB-','B+','B-','A-'],
            required:true
        },
        price:{
            type:String,
            default:'free'
        },
        disease:{
            type:String,
        },
        status:{
            type:String,
            default:'pending',
            enum:['pending','accept','reject']
        },
        owner:{
            type:mongoose.Types.ObjectId,
            ref:'User'
        }
    },{timestamps:true})

export const Bloodbank=mongoose.model('Bloodbank',bloodbankSchema)

