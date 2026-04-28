import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useStateValue } from "../state/StateProvider";
import { useNavigate } from "react-router-dom";
import { db } from "../auth/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

function Payment() {
    const [{ basket, user }, dispatch] = useStateValue();
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();

    const [processing, setProcessing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("card");
    
    // নতুন স্টেট: ঠিকানা এবং ফোন নম্বরের জন্য
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");

    const totalPrice = basket?.reduce((amount, item) => item.price + amount, 0);

    const handleOrder = async (e) => {
        e.preventDefault();

        // ভ্যালিডেশন: ঠিকানা এবং ফোন নম্বর দেওয়া হয়েছে কি না
        if (!address || !phone) {
            alert("অনুগ্রহ করে আপনার ঠিকানা এবং ফোন নম্বর দিন।");
            return;
        }

        if (paymentMethod === "card" && (!stripe || !elements)) return;

        setProcessing(true);
        const orderId = `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

        try {
            await setDoc(doc(db, "users", user?.uid, "orders", orderId), {
                basket: basket,
                amount: totalPrice,
                method: paymentMethod === "card" ? "Card Payment" : "Cash on Delivery",
                status: "Processing",
                address: address, // ডেটাবেসে ঠিকানা সেভ
                phone: phone,     // ডেটাবেসে ফোন সেভ
                created: new Date().getTime(),
                timestamp: serverTimestamp()
            });

            dispatch({ type: 'EMPTY_BASKET' });
            alert(paymentMethod === "card" ? "Card Payment Successful!" : "Order Placed Successfully!");
            navigate('/orders', { replace: true });
        } catch (err) {
            alert("Error: " + err.message);
        }
        setProcessing(false);
    };

    return (
        <div className='bg-gray-100 min-h-screen p-5'>
            <div className='bg-white max-w-2xl mx-auto p-8 shadow-md rounded-md'>
                <h1 className='text-2xl font-bold border-b pb-4 mb-6 text-center text-gray-800'>Checkout</h1>

                {/* ডেলিভারি ইনফরমেশন সেকশন */}
                <div className='mb-6 space-y-4 border-b pb-6'>
                    <h3 className='font-bold text-gray-700'>Delivery Information:</h3>
                    <div className='flex flex-col space-y-1'>
                        <label className='text-xs font-bold text-gray-500 uppercase'>Shipping Address</label>
                        <textarea 
                            className='border p-2 rounded-md outline-none focus:ring-1 focus:ring-yellow-500 text-sm' 
                            rows="2" 
                            placeholder="House #, Road #, Area, City..."
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                        />
                    </div>
                    <div className='flex flex-col space-y-1'>
                        <label className='text-xs font-bold text-gray-500 uppercase'>Phone Number</label>
                        <input 
                            type="text" 
                            className='border p-2 rounded-md outline-none focus:ring-1 focus:ring-yellow-500 text-sm' 
                            placeholder="017XXXXXXXX"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className='mb-6'>
                    <h3 className='font-bold mb-3 text-gray-700'>Select Payment Method:</h3>
                    <div className='flex gap-4'>
                        <button 
                            type="button"
                            onClick={() => setPaymentMethod("card")}
                            className={`flex-1 py-2 border rounded-md font-semibold transition ${paymentMethod === 'card' ? 'bg-[#232f3e] text-white border-[#232f3e]' : 'bg-white text-gray-700'}`}
                        >
                            Credit/Debit Card
                        </button>
                        <button 
                            type="button"
                            onClick={() => setPaymentMethod("cod")}
                            className={`flex-1 py-2 border rounded-md font-semibold transition ${paymentMethod === 'cod' ? 'bg-[#232f3e] text-white border-[#232f3e]' : 'bg-white text-gray-700'}`}
                        >
                            Cash on Delivery
                        </button>
                    </div>
                </div>

                <form onSubmit={handleOrder} className='space-y-6'>
                    {paymentMethod === "card" ? (
                        <div className='border p-4 rounded bg-gray-50'>
                            <CardElement options={{style: {base: {fontSize: '16px'}}}} />
                        </div>
                    ) : (
                        <div className='p-4 bg-yellow-50 border border-yellow-200 rounded text-yellow-800 text-sm'>
                            আপনি পণ্য হাতে পাওয়ার পর <strong>${totalPrice}</strong> পরিশোধ করবেন।
                        </div>
                    )}

                    <div className='border-t pt-4'>
                        <div className='flex justify-between text-xl font-bold mb-4'>
                            <span>Order Total:</span>
                            <span className='text-red-700'>${totalPrice}</span>
                        </div>
                        <button 
                            disabled={processing || basket.length === 0} 
                            className={`w-full py-3 rounded font-bold text-white transition ${paymentMethod === 'card' ? 'bg-[#f0c14b] hover:bg-[#ddb347] text-black border border-[#a88734]' : 'bg-[#f0c14b] hover:bg-[#ddb347] text-black border border-[#a88734]'}`}
                        >
                            {processing ? "Processing..." : paymentMethod === 'card' ? "Pay with Card" : "Confirm COD Order"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Payment;