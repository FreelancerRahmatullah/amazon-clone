import React from "react";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-[#232f3e] text-white mt-10">
      {/* Back to top button */}
      <div
        onClick={scrollToTop}
        className="bg-[#37475a] hover:bg-[#485769] p-4 text-center text-sm font-bold cursor-pointer"
      >
        Back to top
      </div>

      {/* Footer Links */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10 max-w-screen-xl mx-auto py-10 px-10">
        <div className="space-y-3">
          <h4 className="font-bold">Get to Know Us</h4>
          <p className="text-sm hover:underline cursor-pointer">Careers</p>
          <p className="text-sm hover:underline cursor-pointer">Blog</p>
          <p className="text-sm hover:underline cursor-pointer">About Amazon</p>
        </div>

        <div className="space-y-3">
          <h4 className="font-bold">Make Money with Us</h4>
          <p className="text-sm hover:underline cursor-pointer">
            Sell on Amazon
          </p>
          <p className="text-sm hover:underline cursor-pointer">
            Protect and Build Your Brand
          </p>
          <p className="text-sm hover:underline cursor-pointer">
            Become an Affiliate
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="font-bold">Amazon Payment Products</h4>
          <p className="text-sm hover:underline cursor-pointer">
            Amazon Business Card
          </p>
          <p className="text-sm hover:underline cursor-pointer">
            Shop with Points
          </p>
          <p className="text-sm hover:underline cursor-pointer">
            Reload Your Balance
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="font-bold">Let Us Help You</h4>
          <p className="text-sm hover:underline cursor-pointer">Your Account</p>
          <p className="text-sm hover:underline cursor-pointer">
            Shipping Rates & Policies
          </p>
          <p className="text-sm hover:underline cursor-pointer">Help</p>
        </div>
      </div>

      <div className="border-t border-gray-600 py-10 flex flex-col items-center">
        <img
          src="https://pngimg.com"
          className="w-20 object-contain mb-5"
          alt="logo"
        />
        <p className="text-xs text-gray-400">
          © 1996-2024, Amazon.com, Inc. or its affiliates (Clone project)
        </p>
      </div>
    </div>
  );
};

export default Footer;
