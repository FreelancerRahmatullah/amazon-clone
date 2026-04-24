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
}) {
  const [{}, dispatch] = useStateValue();

  const addToBasket = () => {
    dispatch({
      type: "ADD_TO_BASKET",
      item: { id:id, title, image, price, description },
    });
  };

  return (
    <div className="relative flex flex-col m-5 bg-white z-30 p-10 grow border border-gray-200 rounded-sm">
      <p className="absolute top-2 right-2 text-xl italic text-gray-500 ">
        {category}
      </p>
      <img
        src={image}
        alt="images"
        className="h-48 w-48 object-contain mx-auto"
      />
      <h4 className="my-3 font-medium line-clamp-1">{title}</h4>
      <div className="flex text-yellow-500">
        <Star size={16} fill="currentColor" />
        <Star size={16} fill="currentColor" />
        <Star size={16} fill="currentColor" />
        <Star size={16} fill="currentColor" />
        <Star size={16} fill="currentColor" />
      </div>
      <p className="text-xs my-2 line-clamp-2">{description}</p>
      <div className="mb-6 font-bold">
        <span>$</span>
        {price}
      </div>
      <button
        onClick={addToBasket}
        className="mt-auto bg-[#ffd814] hover:bg-[#f7ca00] border border-[#fcd200] py-1.5 rounded-md text-sm active:from-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
      >
        Add to Cart
      </button>
    </div>
  );
}
