import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [searchItem, setSearchItem] = useState("");

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const fetchAllProducts = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/products/allproducts",
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true
        }
      );
      setProducts(res.data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleSearch = async () => {
    if (!searchItem.trim()) {
      fetchAllProducts();
      return;
    }
    try {
      const res = await axios.get(
        `http://localhost:5000/api/products/search?keyword=${encodeURIComponent(searchItem)}`,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true
        }
      );
      setProducts(res.data.products);
    } catch (error) {
      console.error("Error searching products:", error);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search Items.."
            value={searchItem}
            onChange={(e) => setSearchItem(e.target.value)}
            className="border px-4 py-2 rounded-lg bg-white"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Search
          </button>
        </div>
        <Link
          to="/sell"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Sell Your Items
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product._id} className="border p-4 rounded shadow">
            <img
              src={
                product?.image
                  ? product.image.startsWith("http")
                    ? product.image // External URL (Cloudinary, etc.)
                    : `http://localhost:5000/Uploads/${product.image.split("\\").pop()}`
                  : "/default-book.jpg" // fallback image if missing
              }
              alt={product.name || "Book"}
              className="w-full h-48 object-contain mb-4 rounded bg-white"
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
    </div>
  );
};

export default AllProducts;
