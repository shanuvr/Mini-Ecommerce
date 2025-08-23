import mongoose from "mongoose";
import { type } from "os";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true

    },
    email:{
        type:String,
        required:true

    },
    password:{
        type:String,
        required:true

    },
    profilePicture:{
        type:String
    },
    isActive:{
        type:Boolean,
        default:true
    }
})

const userModel = mongoose.model("user",userSchema)
export default userModel
