import { generateCookie } from "../utility/feature.js";
import { User } from "../Model/userModel.js";
import bcrypt from 'bcrypt';

export const userRegister=async(req,res)=>{
    const {name,email,password,user_type}=req.body;
    let user=await User.findOne({email});
    if(user){
        return res.status(400).json({
            success:true,
            message:'email already exists'
        })
    }
    const hashPassword=await bcrypt.hash(password,10)
    user=await User.create({
        name,email,password:hashPassword,user_type
    })
    generateCookie(user,res,201,'User register successfully')
    console.log("Response Headers:",res.getHeaders())
}

export const userLogin=async(req,res)=>{
    const {email,password}=req.body;
    let user=await User.findOne({email});
    if(!user){
        return res.status(400).json({
            success:false,
            message:'User not exist'
        })
    }
    const isMatch=await bcrypt.compare(password,user.password)
    if(!isMatch) return res.status(400).json({
        success:false,
        message:"Invalid credential"
    })
    generateCookie(user,res,201,`Welcome back ${user.name}`)
    console.log("Response Headers:",res.getHeaders())
}

export const useLogout=(req,res)=>{
    res.status(200).cookie("token",{
        expires:new Date(Date.now())
    }).json({
        success:true,
        message:'Logout successfully'
    })
    console.log("Logout Successfully")
}
export const getMyProfile=(req,res)=>{
    res.status(200).json({
        success:true,
        user:req.user
    })
}

export const updateProfile=async(req,res) => {
  try {
    const { id } = req.params;  // user id from URL
    const updates = req.body;   // e.g. { address, mobileno }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true } // return updated doc & validate schema
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating user" });
  }
}

export const getAllUser=(req,res)=>{
    
}