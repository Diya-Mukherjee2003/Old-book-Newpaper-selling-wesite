import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  // fetch cart + user details
  useEffect(() => {
    const fetchData = async () => {
      try {
        // get cart from backend
        const cartRes = await axios.get("http://localhost:5000/api/cart/mycart", {
          withCredentials: true,
        });
        setCart(cartRes.data.cart.items || []);

        // get logged in user
        const userRes = await axios.get("http://localhost:5000/api/users/myprofile", {
          withCredentials: true,
        });
        setUser(userRes.data.user);
      } catch (error) {
        console.error("Error fetching checkout data", error);
      }
    };
    fetchData();
  }, []);

  // confirm order
  const handleConfirmOrder = async () => {
    try {
      const productsPayload = cart.map((item) => ({
        product_id: item.product_id._id,
        quantity: item.quantity,
      }));

      const res = await axios.post(
        "http://localhost:5000/api/orders",
        { products: productsPayload },
        { withCredentials: true }
      );

      alert("Order placed successfully!");

      // redirect to success page with order id
      navigate(`/order-success/${res.data.order._id}`);
    } catch (error) {
      console.error(error);
      alert("Order failed!");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>

      {/* Cart Summary */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold mb-2">Cart Summary</h2>
        {cart.length === 0 ? (
          <p>No items in cart</p>
        ) : (
          cart.map((item, idx) => (
            <div key={idx} className="flex justify-between mb-2">
              <span>
                {item.product_id.name} × {item.quantity}
              </span>
              <span>₹{item.product_id.price * item.quantity}</span>
            </div>
          ))
        )}
      </div>

      {/* Buyer Info */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold mb-2">Buyer Info</h2>
        <p><b>Name:</b> {user.name}</p>
        <p><b>Email:</b> {user.email}</p>
      </div>

      <button
        onClick={handleConfirmOrder}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg"
      >
        Confirm Order (COD)
      </button>
    </div>
  );
};

export default Checkout;
