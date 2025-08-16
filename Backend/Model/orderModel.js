import mongoose from "mongoose";
const  OrderSchema=new mongoose.Schema({
    buyer_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    seller_ids: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    ],
    products: [
        {
            product_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },
            seller_id: { // track seller per product
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            quantity: {
                type: Number,
                default: 1
            }
        }
    ],
    status:{
        type:String,
        enum:['pending','cancelled','completed'],
        default:'pending'
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
export const Order=mongoose.model("Order",OrderSchema)