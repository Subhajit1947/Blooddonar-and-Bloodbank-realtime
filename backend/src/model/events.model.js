import mongoose,{Schema} from "mongoose";

const eventSchema=new Schema(
    {
        date:{
            type:String,
            required:true
        },
        time:{
            type:String,
            required:true
            
        },
        title:{
            type:String,
            required:true
        },
        vanue:{
            type:String,
            required:true
        },
        contactno:{
            type:String
        },
        owner:{
            type:mongoose.Types.ObjectId,
            ref:'User'
        }
    },{timestamps:true})

export const Event=mongoose.model('Event',eventSchema)

