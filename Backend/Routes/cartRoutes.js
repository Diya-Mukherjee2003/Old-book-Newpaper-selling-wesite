import express from "express";
import { addtocart,removecart,updatecart,viewcart } from "../Mvc-controller/CartController.js";
import { isAuthenticated } from "../middleware/auth.js";


const Router=express.Router()

Router.post('/add',isAuthenticated,addtocart)
Router.get('/mycart',isAuthenticated,viewcart)
Router.put('/update/:id',isAuthenticated,updatecart)
Router.delete('/remove/:id',isAuthenticated,removecart)

export default Router