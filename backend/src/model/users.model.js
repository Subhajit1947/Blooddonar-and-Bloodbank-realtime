import mongoose,{Schema} from "mongoose";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
const userSchema=new Schema({
    fullName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        lowercase:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    address:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true,
        unique:true
    },
    city:{
        type:String,
        required:true,
        lowercase:true
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    avatar:{
        type:String
    },
    refresh_token:{
        type:String
    }

},{timestamps:true})
userSchema.pre('save',async function(next){
    if(!this.isModified('password'))
        next()
    this.password= await bcrypt.hash(this.password,10)
    next()
})
userSchema.methods.isPasswordCorrect=async function(password){
    try {
       return await bcrypt.compare(password,this.password)
    }
    catch (error) {
       console.log() 
    }
}
userSchema.methods.generateAccessToken=async function(){
    return jwt.sign(
        {
            _id:this._id,
            email:this.email
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefeshToken=async function(){
    return jwt.sign(
        {
            _id:this._id,
            
        },
        process.env.REFESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFESH_TOKEN_EXPIRY
        }
    )
}
export const User=mongoose.model('User',userSchema)
