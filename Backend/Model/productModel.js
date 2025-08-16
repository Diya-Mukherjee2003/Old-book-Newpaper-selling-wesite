import mongoose from "mongoose";
const ProductSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    category:{
        type:String,
        enum:['newspaper','book','journal'],
        required:true
    },
    image: {
        type: String,  
        required: true
    },
    quantity:{
        type:Number,
        required:true,
        default:1
    },
    seller_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})
export const Product=mongoose.model("Product",ProductSchema)