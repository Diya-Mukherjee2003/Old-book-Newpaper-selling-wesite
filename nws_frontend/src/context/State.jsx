// State.jsx
import React, { useEffect, useState } from "react";
import Context from "./Context";
import axios from "axios";

export default function State({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [cart, setCart] = useState(() => {
    // Load cart from localStorage on first render
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : { items: [] };
  });

  // Check authentication status
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/auth/check", { withCredentials: true })
      .then((res) => setIsAuthenticated(res.data.loggedIn))
      .catch(() => setIsAuthenticated(false))
      .finally(() => setAuthLoading(false));
  }, []);

  // Save cart to localStorage if user is not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart, isAuthenticated]);

  return (
    <Context.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        authLoading,
        cart,
        setCart,
      }}
    >
      {children}
    </Context.Provider>
  );
}
