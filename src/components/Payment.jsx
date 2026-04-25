import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useStateValue } from "../state/StateProvider";
import { useNavigate } from "react-router-dom";
import { db } from "../auth/firebase";
import { doc, setDoc } from "firebase/firestore"; // collection ইম্পোর্ট দরকার নেই যদি সরাসরি doc ব্যবহার করেন

function Payment() {
    const [{ basket, user }, dispatch] = useStateValue();
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();

    const [error, setError] = useState(null);
    const [disabled, setDisabled] = useState(true);
    const [processing, setProcessing] = useState("");
    const [succeeded, setSucceeded] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        if (!stripe || !elements) return; // Stripe লোড না হলে থামিয়ে দিন

        setProcessing(true);

        // প্রফেশনাল পেমেন্ট ফ্লো (সংক্ষিপ্ত রূপ):
        // ১. ব্যাকএন্ড থেকে clientSecret আনতে হয় (যদি আসল পেমেন্ট করতে চান)
        // ২. stripe.confirmCardPayment(clientSecret, ...) কল করতে হয়।
        
        try {
            const orderId = `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

            // ফায়ারবেসে ডাটা সেভ
            if(user) {
                await setDoc(doc(db, "users", user?.uid, "orders", orderId), {
                    basket: basket,
                    amount: basket.reduce((amount, item) => item.price + amount, 0),
                    created: new Date().getTime()
                });

                setSucceeded(true);
                setError(null);
                setProcessing(false);

                dispatch({ type: 'EMPTY_BASKET' });
                
                alert("Payment Successful!");
                navigate('/orders', { replace: true });
            } else {
                alert("Please log in to complete payment");
                setProcessing(false);
            }
            
        } catch (err) {
            setError(`Payment Error: ${err.message}`);
            setProcessing(false);
        }
    };

    const handleChange = event => {
        setDisabled(event.empty);
        setError(event.error ? event.error.message : "");
    };

    return (
        <div className='bg-gray-100 min-h-screen p-5'>
            <div className='bg-white max-w-4xl mx-auto p-10 shadow-md rounded-md'>
                <h1 className='text-2xl font-bold border-b pb-5 mb-5 text-center'>
                    Review Your Order ({basket?.length} items)
                </h1>
                
                {/* Delivery Info */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-10'>
                    <div className='font-bold'>Delivery Address:</div>
                    <div className='text-gray-600 italic'>
                        {user ? user.email : "Guest User"}<br />
                        123 React Lane, Sector 7<br />
                        Uttara, Dhaka
                    </div>
                </div>

                {/* Items Review */}
                <div className='border-t pt-5 mb-10'>
                    <h3 className='font-bold mb-3'>Review Items:</h3>
                    {basket.map((item, i) => (
                        <p key={i} className="text-sm">{item.title} - <strong>${item.price}</strong></p>
                    ))}
                </div>

                {/* Payment Form */}
                <div className='border-t pt-5'>
                    <h3 className='font-bold mb-5'>Payment Method</h3>
                    <form onSubmit={handleSubmit} className='max-w-md mx-auto'>
                        <div className='border p-4 rounded-md mb-3 bg-white shadow-inner'>
                            <CardElement onChange={handleChange} options={{
                                style: {
                                    base: { fontSize: '16px', color: '#424770', '::placeholder': { color: '#aab7c4' } },
                                    invalid: { color: '#9e2146' },
                                },
                            }} />
                        </div>
                        
                        {error && <div className="text-red-500 text-sm mb-4 font-semibold">{error}</div>}

                        <button 
                            disabled={processing || disabled || succeeded || basket.length === 0}
                            className={`w-full py-3 rounded-md font-bold text-white transition-all ${
                                (processing || disabled) ? 'bg-gray-400' : 'bg-orange-500 hover:bg-orange-600'
                            }`}
                        >
                            <span>{processing ? "Processing..." : `Pay $${basket.reduce((amount, item) => item.price + amount, 0)} Now`}</span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Payment;
