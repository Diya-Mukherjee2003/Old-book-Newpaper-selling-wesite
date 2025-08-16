import { Cart } from "../Model/cartModel.js";
import { Product } from "../Model/productModel.js";

export const addtocart=async(req,res)=>{
    try{
        const user_id = req.user._id;
        const {product_id,quantity}=req.body;
        const user=req.user

        if(user.user_type!=="buyer"){
            return res.status(403).json({
                success:false,
                message:'Only buyer can add products'
            })
        }
        let cart=await Cart.findOne({user_id})
        
        if(!cart){
            cart=new Cart({user_id,items:[{product_id,quantity}]});
        }else{
            const itemIndex=cart.items.findIndex(
                (item)=>item.product_id.toString()===product_id
            );
            if(itemIndex>1){
                cart.items[itemIndex].quantity+=quantity;
            }else{
                cart.items.push({product_id,quantity});
            }
        }
        await cart.save();
        res.status(200).json({ success: true, message: "Product added to cart", cart });

    }catch(err){
        res.status(500).json({
            success:false,
            message:'Internal server error',
            
        })
    }
}

export const viewcart=async(req,res)=>{
    try{
        const user_id=req.user._id
        const user=req.user
        if(user.user_type!=='buyer'){
            return res.status(403).json({
                    success:false,
                    message:'Only buyer can add products'
            })
        }
        const cart=await Cart.findOne({user_id})
        .populate('items.product_id')//Reason behingd populating this I want the entire object so that I can print name or price not the just ref no
        if(!cart){
            return res.status(200).json({
                success:true,
                message:'cart is empty',
                cart: { items: [] }
            })
        }else{
            return res.status(200).json({
                success:true,
                message:"Here is your cart",
                cart
            })
        }
    }catch(err){
        res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
}

export const updatecart = async (req, res) => {
    try {
        console.log("=== UPDATE CART DEBUG START ===");
        console.log("User ID:", req.user._id);
        console.log("Product ID from params:", req.params.id);
        console.log("Change value:", req.body.change);

        if (req.user.user_type !== "buyer") {
            return res.status(403).json({
                success: false,
                message: "Only buyer can update products in the cart"
            });
        }

        const user_id = req.user._id;
        const product_id = req.params.id;
        const { change } = req.body;

        if (change !== 1 && change !== -1) {
            return res.status(400).json({
                success: false,
                message: "Change must be either +1 or -1"
            });
        }

        // Find the cart first to see what we're working with
        const cart = await Cart.findOne({ user_id });
        if (!cart) {
            console.log("❌ No cart found for user:", user_id);
            return res.status(404).json({
                success: false,
                message: "Cart not found for this user"
            });
        }

        console.log("✅ Cart found with", cart.items.length, "items");
        console.log("📦 Cart items:");
        cart.items.forEach((item, index) => {
            console.log(`  Item ${index}:`, {
                product_id: item.product_id,
                product_id_type: typeof item.product_id,
                quantity: item.quantity,
                _id: item._id
            });
        });

        // Try to find the item with detailed logging
        let itemIndex = -1;
        console.log("🔍 Looking for product_id:", product_id);
        
        for (let i = 0; i < cart.items.length; i++) {
            const item = cart.items[i];
            const itemProductId = item.product_id._id ? item.product_id._id.toString() : item.product_id.toString();
            console.log(`  Comparing: "${itemProductId}" === "${product_id}" ? ${itemProductId === product_id}`);
            
            if (itemProductId === product_id) {
                itemIndex = i;
                break;
            }
        }

        if (itemIndex === -1) {
            console.log("❌ Product not found in cart!");
            console.log("Available product IDs:", 
                cart.items.map(item => item.product_id._id ? item.product_id._id.toString() : item.product_id.toString())
            );
            console.log("Requested product ID:", product_id);
            console.log("Product ID type:", typeof product_id);
            
            return res.status(404).json({
                success: false,
                message: "Product not found in cart",
                debug: {
                    requestedId: product_id,
                    availableIds: cart.items.map(item => item.product_id._id ? item.product_id._id.toString() : item.product_id.toString())
                }
            });
        }

        console.log(`✅ Found item at index ${itemIndex}`);
        console.log(`📊 Current quantity: ${cart.items[itemIndex].quantity}`);

        // Update the quantity
        cart.items[itemIndex].quantity += change;
        console.log(`📊 New quantity: ${cart.items[itemIndex].quantity}`);

        if (cart.items[itemIndex].quantity <= 0) {
            console.log("🗑️ Removing item due to zero quantity");
            cart.items.splice(itemIndex, 1);
        }

        await cart.save();
        console.log("💾 Cart saved successfully");

        // Fetch the updated cart with population
        const updatedCart = await Cart.findOne({ user_id })
            .populate("items.product_id");

        console.log("📦 Updated cart items after population:");
        updatedCart.items.forEach((item, index) => {
            console.log(`  Item ${index}:`, {
                product_id: item.product_id._id,
                name: item.product_id.name,
                price: item.product_id.price,
                quantity: item.quantity
            });
        });

        console.log("=== UPDATE CART DEBUG END ===");

        return res.status(200).json({
            success: true,
            message: "Cart updated successfully",
            cart: updatedCart
        });

    } catch (err) {
        console.error("💥 Update cart error:", err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err.message
        });
    }
};


export const removecart=async(req,res)=>{
    try{
        const user = req.user;

        if (user.user_type !== "buyer") {
            return res.status(403).json({
                success: false,
                message: "Only buyer can remove products"
            });
        }
    
        const user_id = req.user._id;
        const product_id = req.params.id;

        const cart = await Cart.findOne({ user_id });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found for this user"
            });
        }
        console.log("Incoming Product ID:", product_id);
        console.log("Cart Items before:", cart.items.map(i => i.product_id.toString()));
        
        cart.items = cart.items.filter(item => item.product_id.toString() !== product_id);
        await cart.save();

        return res.status(200).json({
            success: true,
            message: "Product removed from cart"
        });
        
    }catch(err){
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err.message
        });
    }

}
