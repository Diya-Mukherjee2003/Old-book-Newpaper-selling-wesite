import { generateCookie } from "../utility/feature.js";
import { Product } from "../Model/productModel.js";
import bcrypt from 'bcrypt';

export const addProduct=async(req,res)=>{
    try{
        const {name, description, price, category,quantity}=req.body;
        const seller_id = req.user?._id; // Safe access to avoid errors
        console.log("🔐 Authenticated Seller ID:", seller_id);
        console.log("📦 Request Body:", req.body);

        if (!seller_id) {
            return res.status(401).json({ success: false, message: "Unauthorized: Please log in" });
        }

        const image = req.file?.path; // wrap in array since your schema expects an array

        if (!image || image.length === 0) {
            return res.status(400).json({ success: false, message: "Image is required" });
        }
        
        const product=await Product.create({
            name, description, price, category, image,quantity,seller_id
        })
        res.status(200).json({
            success:true,
            message:'Product Added successfully',
            product
        })
    }catch(err){
        res.status(500).json({success:false,message:err.message})
    }    
}

export const updateProduct=async(req,res)=>{
    const product_id = req.params.id;
    try{
        const product=await Product.findById(product_id)
        if(!product){
            return res.status(400).json({
                success:false,
                message:'Product not Found'
            })
        }   // Here we can combine findbyID and findByIdAndUpdate with only findByIdAndUpdate but for now its okay
        const updatedProduct=await Product.findByIdAndUpdate(product_id,req.body,{new:true})
        res.status(200).json({
            success:true,
            message:'Product updated successfully',
            product:updatedProduct
        })
    }catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
    
}

export const deleteProduct=async(req,res)=>{
    const product_id = req.params.id;
    try{
        const product=await Product.findByIdAndDelete(product_id)
        if(!product){
            return res.status(400).json({
                success:false,
                message:'Product not Found'
            })
        }
        res.status(200).json({
            success:true,
            message:'Product deleted successfully',
        })
    }catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
    
}

export const getAllProduct=async(req,res)=>{
    try{
        const page=parseInt(req.query.page)||1
        const limit=parseInt(req.query.limit)||10
        const skip = (page - 1) * limit;
        const products=await Product.find().sort({createdAt:-1}).skip(skip).limit(limit);
        return res.status(200).json({
            success:true,   // We can alos include try catch block here
            message:'All products fetched successfully',
            currentpage:page,
            totalpages:Math.ceil(products/limit),
            products
        })
    }catch(err){
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: err.message
        });
    }
}


export const getMyProduct=async(req,res)=>{
    try{
        const sellerID= req.user._id;
        const myproduct= await Product.find({seller_id:sellerID}); // In this line was error and in productroutes 
        if(myproduct.length>0){
            return res.status(200).json({
                success:true,
                message:"These are my selling products",
                myproduct
            })
        }else{
            return res.status(400).json({
                success:false,
                message:"Product not found",
                myproduct
            })
        }
    }catch(err){
        res.status(500).json({
            message:"Internal server error"
        })
    }
}


export const getProductbyID=async(req,res)=>{
   
    console.log('🔍 getProductbyID called with ID:', req.params.id);
    console.log('🔍 Full URL:', req.originalUrl);
    
    const id = req.params.id;
    // ... rest of your existing code stays the same

    try{
        const product=await Product.findById(id)
        if(product){
        return res.status(200).json({
            success:true,   // We can alos include try catch block here
            message:'Here is the product',
            product
        })
        }else{
            return res.status(400).json({
                success:false,   // We can alos include try catch block here
                message:'Product not found',
                product
            })
        }
    }catch(err){
        res.status(404).json({
                success:false,   // We can alos include try catch block here
                message:'ID not found',
        })
    }
}

export const searchProducts = async (req, res) => {
    const { keyword, category, minPrice, maxPrice } = req.query;

    let filter = {};

    // 🔍 Keyword search (name or description)
    if (keyword) {
        filter.$or = [
            {
                name: {
                    $regex: keyword,
                    $options: "i", // case-insensitive
                },
            },
            {
                description: {
                    $regex: keyword,
                    $options: "i",
                },
            },
        ];
    }

    // 📂 Category filter
    if (category) {
        filter.category = category.toLowerCase(); // assuming category enum is lowercase
    }

    // 💰 Price range filter
    if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = Number(minPrice);
        if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    try {
        const products = await Product.find(filter).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            message: "Filtered products fetched successfully",
            products,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message,
        });
    }
};
