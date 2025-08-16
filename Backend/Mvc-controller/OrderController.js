import { Order} from "../Model/orderModel.js";
import { Product } from "../Model/productModel.js";
export const placeOrder = async (req, res) => {
  try {
    const { products } = req.body; // Expecting an array of { product_id, quantity }
    const buyer_id = req.user.id;

    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Products array is required"
      });
    }

    // Fetch all products from DB
    const productDocs = await Product.find({
      _id: { $in: products.map(p => p.product_id) }
    });

    if (productDocs.length !== products.length) {
      return res.status(404).json({
        success: false,
        message: "One or more products not found"
      });
    }

    // Build order data
    const sellerIdsSet = new Set();
    const orderProducts = [];

    for (const p of products) {
      const productDoc = productDocs.find(doc => doc._id.toString() === p.product_id);

      // Prevent self-purchase
      if (productDoc.seller_id.toString() === buyer_id) {
        return res.status(400).json({
          success: false,
          message: `You cannot order your own product: ${productDoc.name}`
        });
      }

      sellerIdsSet.add(productDoc.seller_id.toString());

      orderProducts.push({
        product_id: productDoc._id,
        seller_id: productDoc.seller_id,
        price: productDoc.price,
        quantity: p.quantity || 1
      });
    }

    const newOrder = new Order({
      buyer_id,
      seller_ids: Array.from(sellerIdsSet),
      products: orderProducts,
      status: "pending"
    });

    await newOrder.save();

    res.status(200).json({
      success: true,
      message: "Order placed successfully",
      order: newOrder
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server error", error });
  }
};


export const getBuyerOrder=async(req,res)=>{
    try{
        const buyer_id=req.user.id
        const orders=await Order.find({buyer_id}).populate("product_id", "name price category images");
        res.json(orders);
    }catch(error){
        res.status(500).json({ message: "Internal Server error", error });
    }
}

export const getSellerOrder=async(req,res)=>{
    try{
        const seller_id=req.user.id
        const orders=await Order.find({seller_id}).populate("product_id","name price category images");
        res.json(orders);
    }catch(error){
        res.status(500).json({ message: "Internal Server error", error });
    }
}
export const updateOrderStatus=async(req,res)=>{
    try{
        const seller_id=req.user.id
        const { id } = req.params; // Order ID
        const { status } = req.body; // New status
        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ 
                success:false,
                message: "Order not found" 
            });
        }
        if(order.seller_id.toString()!==seller_id){
            return res.status(403).json({
                success:false,
                message:"Unauthorized to update order"
            })
        }
        order.status = status;
        await order.save();
        res.json({ message: "Order status updated", order });
        }
        catch(error){
            res.status(500).json({ message: "Server error", error });
        }
} 
