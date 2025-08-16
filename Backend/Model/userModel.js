import mongoose from "mongoose";
const UserSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    user_type:{
        type:String,
        enum:['seller','buyer'],
        default:'buyer',
        required:null
    },
    mobileno:{
        type:String,
        required:null
    },
    address:{
        type:String,
        required:null
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})
export const User=mongoose.model("User",UserSchema)