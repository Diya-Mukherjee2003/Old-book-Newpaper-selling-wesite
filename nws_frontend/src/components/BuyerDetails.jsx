import { useState } from "react";
import axios from "axios";

const BuyerDetails = () => {
  const [address, setAddress] = useState("");
  const [mobileno, setMobileno] = useState("");

  // 👇 fetch userId from localStorage (assuming you stored it after login)
  const userId = localStorage.getItem("userId"); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/api/users/update/${userId}`,
        { address, mobileno },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      alert("Details submitted!");
    } catch (error) {
      console.error(error);
      alert("Error!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-sm bg-amber-200 shadow-lg rounded-lg p-8">
        <h1 className="text-2xl font-bold mb-4 text-center text-yellow-900">
          Fill Details
        </h1>
        <form onSubmit={handleSubmit}>
          {/* Address */}
          <div className="relative mb-4">
            <label
              htmlFor="address"
              className="block mb-1 text-sm font-medium text-yellow-900"
            >
              Address
            </label>
            <input
              id="address"
              type="text" // ✅ fixed
              placeholder="Enter your address"
              className="w-full px-4 py-2 border border-yellow-800 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>

          {/* Mobile Number */}
          <div className="relative mb-4">
            <label
              htmlFor="mobileno"
              className="block mb-1 text-sm font-medium text-yellow-900"
            >
              Mobile No
            </label>
            <input
              id="mobileno"
              type="tel" // ✅ fixed
              placeholder="Enter your mobile number"
              className="w-full px-4 py-2 border border-yellow-800 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
              value={mobileno}
              onChange={(e) => setMobileno(e.target.value)}
              pattern="[0-9]{10}" // ✅ validate 10-digit mobile numbers
              required
            />
          </div>

          <button
            className="bg-amber-600 hover:bg-amber-700 text-white border p-2 rounded-xl w-full"
            type="submit"
          >
            Submit Details
          </button>
        </form>
      </div>
    </div>
  );
};

export default BuyerDetails;
