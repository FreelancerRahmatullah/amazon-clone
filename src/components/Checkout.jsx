import React from "react"; // React ইম্পোর্ট নিশ্চিত করুন
import { useStateValue } from "../state/StateProvider";
import { db } from "../auth/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const navigate = useNavigate();
  // ১. user কে ডিস্ট্রাকচার করে নিতে হবে
  const [{ basket, user }, dispatch] = useStateValue();

  const placeOrder = async () => {
    if (!user) {
      alert("অর্ডার করতে আগে লগইন করুন!");
      return navigate("/login");
    }

    if (basket.length === 0) return alert("আপনার কার্ট খালি!");

    try {
      // ফায়ারস্টোরে অর্ডার সেভ করা
      await addDoc(collection(db, "users", user?.uid, "orders"), {
        basket: basket,
        amount: basket.reduce((amount, item) => item.price + amount, 0),
        timestamp: serverTimestamp(),
      });

      alert("অভিনন্দন! আপনার অর্ডারটি সফলভাবে জমা হয়েছে।");

      // ২. অর্ডার সফল হলে কার্ট খালি করা
      dispatch({ type: "EMPTY_BASKET" });
      navigate("/"); // বা আপনার অর্ডার পেজে রিডাইরেক্ট করুন
    } catch (error) {
      console.error("Error placing order: ", error);
      alert("অর্ডার করার সময় সমস্যা হয়েছে: " + error.message);
    }
  };

  const removeFromBasket = (id) => {
    dispatch({
      type: "REMOVE_FROM_BASKET",
      id: id,
    });
  };

  return (
    <div className="flex flex-col lg:flex-row p-5 bg-gray-100 max-w-screen-2xl mx-auto">
      {/* বাম পাশ: প্রোডাক্ট লিস্ট */}
      <div className="flex flex-col grow m-5 shadow-sm">
        <img
          className="w-full object-contain mb-5"
          src="https://ssl-images-amazon.com"
          alt="Ad"
        />

        <div className="flex flex-col p-5 bg-white">
          <h3 className="text-sm font-bold">Hello, {user?.email || 'Guest'}</h3>
          <h1 className="text-3xl border-b pb-4 font-semibold mt-2">
            {basket?.length === 0
              ? "Your Shopping Basket is empty."
              : "Shopping Basket"}
          </h1>

          {basket.map((item, index) => (
            <div key={index} className="flex my-5 border-b pb-5 items-center">
              <img
                src={item.image}
                className="h-44 w-44 object-contain"
                alt={item.title}
              />
              <div className="pl-5 flex-1">
                <p className="text-lg font-bold">{item.title}</p>
                <p className="text-sm my-2 line-clamp-2 text-gray-600">{item.description}</p>
                <p className="font-bold text-xl">${item.price}</p>
                <button
                  onClick={() => removeFromBasket(item.id)}
                  className="mt-3 bg-[#ffd814] hover:bg-[#f7ca00] px-4 py-1.5 rounded-md border border-gray-400 text-sm"
                >
                  Remove from Basket
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ডান পাশ: সাবটোটাল */}
      <div className="flex flex-col bg-white p-10 shadow-md h-fit mt-5 lg:mt-24 min-w-[300px]">
        <h2 className="whitespace-nowrap text-lg">
          Subtotal ({basket?.length} items):{" "}
          <span className="font-bold">
            $
            {basket
              .reduce((amount, item) => item.price + amount, 0)
              .toLocaleString()}
          </span>
        </h2>
        
        <div className="flex items-center mt-2">
           <input type="checkbox" className="mr-2" /> 
           <small>This order contains a gift</small>
        </div>

        <button
          // onClick={placeOrder}
          onClick={()=> navigate('/payment')}
          disabled={basket.length === 0}
          className={`mt-4 w-full p-2 rounded-md border ${
            basket.length === 0 
            ? "bg-gray-300 border-gray-400 cursor-not-allowed" 
            : "bg-[#ffd814] hover:bg-[#f7ca00] border-[#fcd200]"
          }`}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Checkout;
