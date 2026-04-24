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
    <nav className="flex items-center bg-[#131921] p-2 sticky top-0 z-50 justify-between">
      {/* Logo */}
      <Link to="/">
        <div className="mt-2 ml-4 flex items-center border border-transparent hover:border-white p-1 cursor-pointer">
          <img
            src="/amazon.jpg"
            alt="amazon logo"
            className="w-24 object-contain"
          />
        </div>
      </Link>

      {/* Location */}
      <div className="hidden md:flex text-white ml-4 items-center border border-transparent hover:border-white p-1 cursor-pointer">
        <MapPin size={20} className="mt-2" />
        <div className="flex flex-col ml-1">
          <span className="text-xs text-gray-300">Deliver to</span>
          <span className="text-sm font-bold">Bangladesh</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex grow items-center h-10 rounded-md bg-[#febd69] hover:bg-[#f3a847] ml-4 cursor-pointer">
        <input
          type="text"
          className="h-full w-full p-2 grow rounded-l-md focus:outline-none px-4 text-black"
          placeholder="Search Amazon"
        />
        <Search className="p-2 text-[#131921]" size={40} />
      </div>

      {/* Auth Section */}
      <div className="text-white flex items-center space-x-6 mx-6">
        {/* যদি ইউজার লগইন না থাকে তবেই /login এ যাবে */}
        <Link to={!user && '/login'}>
          <div onClick={handleAuthentication} className="cursor-pointer border border-transparent hover:border-white p-1">
            <p className="text-xs">Hello, {user ? user.email : 'Guest'}</p>
            <p className="text-sm font-extrabold">{user ? 'Sign Out' : 'Sign In'}</p>
          </div>
        </Link>
      </div>

      {/* Right Section */}
      <div className="text-white flex items-center space-x-6 mx-6 whitespace-nowrap">
        <div className="cursor-pointer border border-transparent hover:border-white p-1">
          <p className="text-xs">Returns</p>
          <p className="text-sm font-extrabold">& Orders</p>
        </div>

        <Link to="/checkout">
          <div className="relative flex items-center cursor-pointer border border-transparent hover:border-white p-1">
            <ShoppingCart size={30} />
            <span className="absolute top-0 right-0 md:right-8 bg-[#f08804] text-black font-bold rounded-full h-4 w-4 text-[10px] flex items-center justify-center">
              {basket?.length}
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
