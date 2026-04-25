import { Star } from "lucide-react";
import React from "react";
import { useStateValue } from "../state/StateProvider";

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

  const displayImage = Array.isArray(image) ? image[0] : image;

  // রেটিং সংখ্যা নিশ্চিত করা এবং পূর্ণসংখ্যায় রূপান্তর (১ থেকে ৫ এর মধ্যে)
  const finalRating = Math.round(Number(rating)) || 5;
  const starCount = Math.min(5, Math.max(1, finalRating));

  const addToBasket = () => {
    dispatch({
      type: "ADD_TO_BASKET",
      item: { id, title, image: displayImage, price, description, rating: starCount }, // রেটিংও বাস্কেটে পাঠানো ভালো
    });
  };

  return (
    <div className="relative flex flex-col m-5 bg-white z-30 p-10 grow border border-gray-200 rounded-sm shadow-sm">
      <p className="absolute top-2 right-2 text-xs italic text-gray-400 capitalize">
        {category}
      </p>
      
      <img src={displayImage} alt={title} className="h-48 w-48 object-contain mx-auto" />

      <h4 className="my-3 font-medium line-clamp-1">{title}</h4>
      
      {/* স্টার রেন্ডারিং */}
      <div className="flex text-yellow-500">
        {[...Array(starCount)].map((_, i) => (
          <Star key={`yellow-${i}`} size={16} fill="currentColor" />
        ))}
        {[...Array(5 - starCount)].map((_, i) => (
          <Star key={`gray-${i}`} size={16} className="text-gray-300" />
        ))}
      </div>

      <p className="text-xs my-2 line-clamp-2 text-gray-600">{description}</p>
      
      <div className="mb-5 font-bold text-lg">
        <span className="text-sm mr-0.5">$</span>{price}
      </div>

      <button
        onClick={addToBasket}
        className="mt-auto bg-[#ffd814] hover:bg-[#f7ca00] border border-[#a88734] active:from-yellow-500 py-1.5 rounded-md text-sm font-medium transition-all duration-200"
      >
        Add to Cart
      </button>
    </div>
  );
}
