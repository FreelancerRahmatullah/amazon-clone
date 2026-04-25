import { auth } from "../auth/firebase";
import { Search, MapPin, ShoppingCart } from "lucide-react";
import React from "react";
import { useStateValue } from "../state/StateProvider";
import { Link } from "react-router-dom";

export default function Header() {
  // ১. এখানে user কেও নিতে হবে
  const [{ basket, user }, dispatch] = useStateValue();

  // ২. সাইন আউটের জন্য ফাংশনটি যোগ করা হলো
  const handleAuthentication = () => {
    if (user) {
      auth.signOut();
    }
  };

  return (
<nav className="flex items-center bg-[#131921] p-2 sticky top-0 z-50 justify-between gap-2 md:gap-4">
  {/* Logo */}
  <Link to="/">
    <div className="mt-1 ml-1 md:ml-4 flex items-center border border-transparent hover:border-white p-1 cursor-pointer">
      <img
        src="/amazon.jpg"
        alt="amazon logo"
        className="w-16 md:w-24 object-contain"
      />
    </div>
  </Link>

  {/* Location - Hidden on Mobile */}
  <div className="hidden lg:flex text-white ml-2 items-center border border-transparent hover:border-white p-1 cursor-pointer whitespace-nowrap">
    <MapPin size={20} className="mt-2" />
    <div className="flex flex-col ml-1">
      <span className="text-xs text-gray-300">Deliver to</span>
      <span className="text-sm font-bold">Bangladesh</span>
    </div>
  </div>

  {/* Search Bar - Grows to fill space */}
  <div className="flex flex-1 items-center h-9 md:h-10 rounded-md bg-[#febd69] hover:bg-[#f3a847] cursor-pointer">
    <input
      type="text"
      className="h-full w-full p-2 flex-grow rounded-l-md focus:outline-none px-2 md:px-4 text-black text-sm"
      placeholder="Search Amazon"
    />
    <div className="p-2">
      <Search className="text-[#131921]" size={20} />
    </div>
  </div>

  {/* Right Section */}
  <div className="text-white flex items-center space-x-2 md:space-x-6 px-1 md:mx-4 whitespace-nowrap">
    {/* Auth Section */}
    <Link to={!user && "/login"}>
      <div
        onClick={handleAuthentication}
        className="cursor-pointer border border-transparent hover:border-white p-1"
      >
        <p className="text-[10px] md:text-xs">Hello, {user ? user.email.split('@')[0] : "Guest"}</p>
        <p className="text-xs md:text-sm font-extrabold">
          {user ? "Sign Out" : "Sign In"}
        </p>
      </div>
    </Link>

    {/* Orders - Hidden on Mobile/Small screens */}
    <Link to="/orders" className="hidden sm:inline">
      <div className="cursor-pointer border border-transparent hover:border-white p-1">
        <p className="text-xs">Returns</p>
        <p className="text-sm font-extrabold">& Orders</p>
      </div>
    </Link>

    {/* Cart */}
    <Link to="/checkout">
      <div className="relative flex items-center cursor-pointer border border-transparent hover:border-white p-1">
        <ShoppingCart size={28} />
        <span className="absolute -top-1 right-0 md:right-7 bg-[#f08804] text-black font-bold rounded-full h-4 w-4 text-[10px] flex items-center justify-center">
          {basket?.length || 0}
        </span>
        <p className="hidden md:inline font-extrabold text-sm mt-3 ml-1">
          Cart
        </p>
      </div>
    </Link>
  </div>
</nav>
  );
}
