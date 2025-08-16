import mongoose from "mongoose";
const CartSchema=new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
        unique:true
    },
    items: [
        {
            product_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
            quantity: {
                type: Number,
                default: 1,
            },
        },
    ],
    updatedAt:{
        type:Date,
        default:Date.now
    }

})
export const Cart=mongoose.model("Cart",CartSchema)