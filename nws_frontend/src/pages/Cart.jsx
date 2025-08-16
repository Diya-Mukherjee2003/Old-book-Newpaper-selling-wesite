import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Context from "../context/Context.jsx";

const Cart = () => {
  const { isAuthenticated, cart, setCart } = useContext(Context);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    const fetchCart = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/cart/mycart`,
          { headers: { "Content-Type": "application/json" }, withCredentials: true }
        );
        console.log("=== INITIAL CART FETCH ===");
        console.log("Response:", response.data);
        console.log("Cart structure:", JSON.stringify(response.data.cart, null, 2));
        setCart(response.data.cart);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [isAuthenticated, setCart]);

  const handleRemove = async (productId) => {
    if (isAuthenticated) {
      try {
        await axios.delete(
          `http://localhost:5000/api/cart/remove/${productId}`,
          { withCredentials: true }
        );
        setCart((prevCart) => ({
          ...prevCart,
          items: prevCart.items.filter((item) => item.product_id._id !== productId),
        }));
      } catch (err) {
        console.error(err);
        alert("Failed to remove item");
      }
    } else {
      setCart((prevCart) => ({
        ...prevCart,
        items: prevCart.items.filter((item) => item.product_id !== productId),
      }));
    }
  };

  const handleQuantityChange = async (productId, change) => {
    console.log("=== QUANTITY CHANGE ===");
    console.log("Product ID:", productId);
    console.log("Change:", change);
    console.log("Current cart before update:", JSON.stringify(cart, null, 2));
    
    if (isAuthenticated) {
      try {
        const response = await axios.put(
          `http://localhost:5000/api/cart/update/${productId}`,
          { change },
          { withCredentials: true }
        );
        
        console.log("=== UPDATE RESPONSE ===");
        console.log("Full response:", response.data);
        console.log("Updated cart structure:", JSON.stringify(response.data.cart, null, 2));
        
        // Check each item in the response
        if (response.data.cart.items) {
          response.data.cart.items.forEach((item, index) => {
            console.log(`Item ${index}:`, {
              product_id: item.product_id,
              product_id_type: typeof item.product_id,
              quantity: item.quantity,
              hasName: item.product_id?.name ? true : false,
              hasPrice: item.product_id?.price ? true : false
            });
          });
        }
        
        setCart(response.data.cart);
        
        // Log cart state after setting
        setTimeout(() => {
          console.log("=== CART STATE AFTER UPDATE ===");
          console.log("Cart after setState:", JSON.stringify(cart, null, 2));
        }, 100);
        
      } catch (err) {
        console.error("=== UPDATE ERROR ===");
        console.error("Error:", err);
        console.error("Error response:", err.response?.data);
        alert(`Failed to update quantity: ${err.response?.data?.message || err.message}`);
      }
    } else {
      setCart((prevCart) => {
        const updatedItems = prevCart.items
          .map((item) =>
            item.product_id === productId
              ? { ...item, quantity: item.quantity + change }
              : item
          )
          .filter((item) => item.quantity > 0);

        return {
          ...prevCart,
          items: updatedItems,
        };
      });
    }
  };

  if (loading) return <p className="text-center mt-5">Loading cart...</p>;

  if (!cart?.items?.length)
    return <p className="text-center mt-5">Your cart is empty.</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      {cart.items.map((item, index) => {
        console.log(`=== RENDERING ITEM ${index} ===`);
        console.log("Item:", item);
        console.log("Product_id:", item.product_id);
        console.log("Product_id type:", typeof item.product_id);
        
        const product = isAuthenticated
          ? item.product_id
          : { _id: item.product_id, name: item.name, price: item.price };

        console.log("Computed product:", product);

        return (
          <div
            key={item._id || index}
            className="border p-2 mb-2 rounded flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">
                {product?.name || `[NO NAME - Type: ${typeof product}]`}
              </p>
              <p>Price: ₹{product?.price || '[NO PRICE]'}</p>
              <div className="flex items-center gap-2 mt-1">
                <button
                  onClick={() => {
                    const productId = isAuthenticated ? item.product_id._id : item.product_id;
                    console.log("Decrease clicked, using product ID:", productId);
                    handleQuantityChange(productId, -1);
                  }}
                  className="px-2 py-1 bg-gray-200 rounded"
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => {
                    const productId = isAuthenticated ? item.product_id._id : item.product_id;
                    console.log("Increase clicked, using product ID:", productId);
                    handleQuantityChange(productId, +1);
                  }}
                  className="px-2 py-1 bg-gray-200 rounded"
                >
                  +
                </button>
              </div>
            </div>
            <button
              className="bg-amber-600 text-white px-2 py-1 rounded"
              onClick={() => handleRemove(product._id)}
            >
              Remove
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Cart;