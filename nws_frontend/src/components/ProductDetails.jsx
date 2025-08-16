import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Context from "../context/Context";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const { cart, setCart, isAuthenticated } = useContext(Context);

  // Check if product is already in cart
  const alreadyInCart = cart?.items?.some(item =>
    isAuthenticated
      ? item.product_id._id === id // backend cart structure
      : item.product_id === id // local cart structure
  );

  const handleAddToCart = async () => {
    if (alreadyInCart) {
      navigate("/cart"); // Just go to cart if already there
      return;
    }

    if (isAuthenticated) {
      try {
        const response = await axios.post(
          `http://localhost:5000/api/cart/add`,
          { product_id: id, quantity: 1 },
          { headers: { "Content-Type": "application/json" }, withCredentials: true }
        );
        setCart(response.data.cart);
        navigate("/cart");
      } catch (err) {
        console.error(err);
        alert("Cart can't be added");
      }
    } else {
      const existingItem = cart.items.find(item => item.product_id === id);
      let updatedCart;

      if (existingItem) {
        updatedCart = {
          ...cart,
          items: cart.items.map(item =>
            item.product_id === id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      } else {
        updatedCart = {
          ...cart,
          items: [...cart.items, { product_id: id, quantity: 1 }],
        };
      }

      setCart(updatedCart);
      navigate("/cart");
    }
  };

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) {
        alert("No ID found");
        return;
      }
      try {
        const response = await axios.get(
          `http://localhost:5000/api/products/${id}`,
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true
          }
        );
        setProduct(response.data.product);
      } catch (error) {
        console.error(error);
        alert("Details not found");
      }
    };
    fetchDetails();
  }, [id]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      {product ? (
        <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {product.name}
          </h2>
          <p className="text-gray-600 mb-2">{product.description}</p>
          <div className="flex justify-between text-sm text-gray-500 mt-4 border-t pt-4">
            <span className="font-semibold">Price:</span>
            <span className="text-green-600 font-bold">₹{product.price}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span className="font-semibold">Quantity:</span>
            <span>{product.quantity}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span className="font-semibold">Category:</span>
            <span>{product.category}</span>
          </div>
          <div className="flex justify-center mt-4">
            <button
              onClick={handleAddToCart}
              className={`px-4 py-2 rounded text-white ${
                alreadyInCart
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-orange-300 hover:bg-orange-400"
              }`}
            >
              {alreadyInCart ? "Already Added – See Cart" : "Add to Cart"}
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-500 text-lg">Loading...</p>
      )}
    </div>
  );
};

export default ProductDetails;
