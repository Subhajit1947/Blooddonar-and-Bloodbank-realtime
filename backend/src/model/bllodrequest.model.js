import mongoose,{Schema} from "mongoose";

const bloodrequestSchema=new Schema(
    {
        bloodgroup:{
            type:String,
            uppercase:true,
            enum:['O+','O-','A+','AB+','AB-','B+','B-','A-'],
            required:true
        },
        status:{
            type:String,
            default:'pending',
            enum:['pending','accept','reject']
        },
        location:{
            type:String
        },
        owner:{
            type:mongoose.Types.ObjectId,
            ref:'User'
        }
    },{timestamps:true})

export const Bloodrequest=mongoose.model('Bloodrequest',bloodrequestSchema)