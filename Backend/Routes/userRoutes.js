import express from "express";
import { userRegister,userLogin,useLogout, getMyProfile,updateProfile } from "../Mvc-controller/UserController.js";
import { isAuthenticated } from "../middleware/auth.js";
const Router=express.Router();
Router.get('/',(req,res)=>{
    res.json({
        success:true,
        message:'Our_old_newspaper_selling_website'
    })
})
Router.post('/register',userRegister)
Router.post('/login',userLogin)
Router.get('/logout',useLogout)
Router.get('/myprofile',isAuthenticated,getMyProfile)
Router.put('/update/:id',isAuthenticated,updateProfile)

export default Router;