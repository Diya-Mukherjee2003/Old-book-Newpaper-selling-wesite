import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="w-full m-0 p-4 bg-yellow-700 flex justify-between items-center">
      <h1 className="text-white">Old Newspaper  🗞</h1>
          <div className="flex gap-5">
            <Link to="/" className="text-white decoration-0 hover:text-amber-300" >Home</Link>
            <Link to="/register" className="text-white decoration-0 hover:text-amber-300">Register</Link>
            <Link to="/login" className="text-white decoration-0 hover:text-amber-300">Login</Link>
            <Link to="/cart" className="text-white decoration-0 hover:text-amber-300">Cart</Link>
          </div>
    </nav>
  );
}