import express from "express";
import { placeOrder,getBuyerOrder,getSellerOrder,updateOrderStatus } from "../Mvc-controller/OrderController.js";
import { isAuthenticated } from "../middleware/auth.js";

const Router=express.Router()

Router.post("/",isAuthenticated,placeOrder)
Router.get("/buyer",isAuthenticated,getBuyerOrder)
Router.get("/seller",isAuthenticated,getSellerOrder)
Router.put("/update/:id",isAuthenticated,updateOrderStatus)

export default Router