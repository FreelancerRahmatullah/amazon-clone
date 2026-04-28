import { Star } from "lucide-react";
import React from "react";
import { useStateValue } from "../state/StateProvider";
import { Link } from "react-router-dom";

export default function Product({
  id,
  title,
  description,
  category,
  price,
  image,
  rating,
}) {
  const [{}, dispatch] = useStateValue();

  // ইমেজ অ্যারে হোক বা স্ট্রিং, প্রথম ইমেজটি পাওয়ার নিরাপদ উপায়
  const displayImage = Array.isArray(image) ? image[0] : image;

  // রেটিং লজিক: নিশ্চিত করা হচ্ছে এটি ১-৫ এর মধ্যে একটি পূর্ণসংখ্যা
  const finalRating = Math.round(Number(rating)) || 5;
  const starCount = Math.min(5, Math.max(1, finalRating));

  const addToBasket = () => {
    dispatch({
      type: "ADD_TO_BASKET",
      item: {
        id,
        title,
        image: displayImage,
        price: Number(price), // প্রাইসকে নাম্বার হিসেবে পাঠানো সেফ
        description,
        rating: starCount,
      },
    });
  };

  return (
    <div className="relative flex flex-col m-5 bg-white z-30 p-10 grow border border-gray-200 rounded-sm shadow-sm transition-transform duration-200 hover:scale-[1.01]">
      <p className="absolute top-2 right-2 text-xs italic text-gray-400 capitalize">
        {category}
      </p>

      {/* প্রোডাক্ট ডিটেইলস এ যাওয়ার জন্য লিঙ্ক */}
      <Link to={`/product/${id}`} className="cursor-pointer">
        <img
          src={displayImage}
          alt={title}
          className="h-48 w-48 object-contain mx-auto"
        />
      </Link>

      <h4 className="my-3 font-medium line-clamp-1">{title}</h4>

      {/* স্টার রেটিং */}
      <div className="flex text-yellow-500">
        {[...Array(starCount)].map((_, i) => (
          <Star key={`yellow-${i}`} size={16} fill="currentColor" />
        ))}
        {[...Array(5 - starCount)].map((_, i) => (
          <Star key={`gray-${i}`} size={16} className="text-gray-300" />
        ))}
      </div>

      <p className="text-xs my-2 line-clamp-2 text-gray-600 h-8">
        {description}
      </p>

      <div className="mb-5 font-bold text-lg">
        <span className="text-sm mr-0.5">$</span>
        {Number(price).toLocaleString()} {/* বড় সংখ্যা হলে কমা দেখাবে */}
      </div>

      <button
        onClick={addToBasket}
        className="mt-auto bg-[#ffd814] hover:bg-[#f7ca00] border border-[#a88734] active:scale-95 py-1.5 rounded-md text-sm font-medium transition-all duration-100"
      >
        Add to Cart
      </button>
    </div>
  );
}
