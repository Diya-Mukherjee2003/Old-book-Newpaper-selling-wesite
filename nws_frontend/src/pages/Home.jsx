import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products/allproducts", {
          headers: { "Content-Type": "application/json" },
          withCredentials: true
        });
        setProducts(res.data.products); // plural
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProduct();
  }, []);

  return (
    
    <div className="p-6 max-w-7xl mx-auto">
       <div className="bg-amber-200 rounded-lg p-8 text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Welcome to Old Book Store 📚</h1>
        <p className="text-lg text-gray-700 mb-6">
          Buy and sell second-hand books easily. Start your journey today!
        </p>
        <Link
          to="/sell"
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          Start Selling
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.slice(0, 6).map((product) => (
          <div key={product._id} className="border p-4 rounded shadow">
            <img
            src={
              product?.image
                ? product.image.startsWith("http")
                  ? product.image // External URL (Cloudinary, etc.)
                  : `http://localhost:5000/Uploads/${product.image.split("\\").pop()}`
                : "/default-book.jpg" // fallback image if missing
            }
            alt={product.name||"Item"}
            className="w-full h-48 object-cover mb-4 rounded"
          />
            <h2 className="text-xl font-semibold">{product.name}</h2>
            <p className="text-gray-600">price:₹{product.price}</p>
      

            <Link
              to={`/product/${product._id}`}
              className="block text-center bg-blue-600 text-white py-2 mt-2 rounded hover:bg-blue-700"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>

      <div className="text-center mt-6">
        <Link
          to="/allproducts"
          className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700"
        >
          See All Products →
        </Link>
      </div>
    </div>
  );
};

export default Home;
