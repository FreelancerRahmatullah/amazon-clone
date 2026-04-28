import React from 'react';
import { Menu } from 'lucide-react';

const SubHeader = ({ setCategoryTerm }) => {
  const categories = ["All", "Electronics", "Fashion", "Home & Kitchen", "Books", "Beauty"];

  return (
    <div className="flex items-center space-x-3 bg-[#232f3e] text-white text-sm py-2 px-4 shadow-md overflow-x-auto whitespace-nowrap scrollbar-hide">
      <p className="flex items-center font-bold cursor-pointer hover:border border-white p-1">
        <Menu size={18} className="mr-1" /> All
      </p>
      
      {categories.map((cat) => (
        <p 
          key={cat} 
          onClick={() => setCategoryTerm(cat === "All" ? "" : cat)}
          className="cursor-pointer hover:border border-white p-1 transition duration-150"
        >
          {cat}
        </p>
      ))}
      
      <p className="hidden lg:inline-flex cursor-pointer hover:border border-white p-1">Customer Service</p>
      <p className="hidden lg:inline-flex cursor-pointer hover:border border-white p-1">Registry</p>
      <p className="hidden lg:inline-flex cursor-pointer hover:border border-white p-1">Gift Cards</p>
      <p className="hidden lg:inline-flex cursor-pointer hover:border border-white p-1">Sell</p>
    </div>
  );
};

export default SubHeader;