import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx"; 
import AllProducts from "./pages/AllProducts.jsx";
import ProductDetails from "./components/ProductDetails.jsx";
import Context from "./context/Context.jsx";
import { useContext, useEffect } from "react";
import Cart from "./pages/Cart.jsx";

function App() {
  const auth=useContext(Context)
  const navigate=useNavigate();
  useEffect(()=>{
    if(!auth.isAuthenticated){
      navigate('/')
    }
  },[auth.isAuthenticated])
  return (
    <div className="bg-orange-100 min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/allproducts" element={<AllProducts/>}/>
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      
    </div>
  );
}

export default App;