import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import Banner from "./components/Banner";
import Product from "./components/Product";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Checkout from "./components/Checkout";
import Login from "./components/Login";
import { useStateValue } from "./state/StateProvider";
import { auth, db } from "./auth/firebase"; 
import { collection, onSnapshot, query, orderBy } from "firebase/firestore"; 
import Footer from "./components/Footer";
import Orders from "./components/Orders";
import { loadStripe } from "@stripe/stripe-js";
import Payment from "./components/Payment";
import { Elements } from "@stripe/react-stripe-js"; 
import Admin from "./components/Admin";

const promise = loadStripe("pk_test_51TPifFQj9SEskcsf2CVHpqPl3Sf6aIusdlZotUFgYkx0g56kih7Cv5ko443svyBjNyO6OY1XPsA3s4IzMyYy7afn00Ait0z3Re");

export default function App() {
  const [dbProducts, setDbProducts] = useState([]); 
  const [apiProducts, setApiProducts] = useState([]); 
  const [{}, dispatch] = useStateValue();

  // ১. ফায়ারবেস থেকে আপনার নিজস্ব প্রোডাক্ট আনা
  useEffect(() => {
    const q = query(collection(db, "products"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setDbProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  // ২. API থেকে ডামি প্রোডাক্ট আনা
  useEffect(() => {
    fetch("https://dummyjson.com/products")
      .then((res) => res.json())
      .then((data) => setApiProducts(data.products))
      .catch((err) => console.error("Error:", err));
  }, []);

  // ৩. ইউজারের লগইন স্টেট চেক করা
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        dispatch({ type: "SET_USER", user: authUser });
      } else {
        dispatch({ type: "SET_USER", user: null });
      }
    });
    return () => unsubscribe();
  }, [dispatch]);

  const allProducts = [...dbProducts, ...apiProducts];

  return (
    <Router>
      <div className="bg-gray-100 min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={
              <main className="max-w-screen-2xl mx-auto">
                <Banner />
                <div className="grid grid-flow-row-dense md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mx-auto px-4 md:-mt-40 z-30 relative">
                  {allProducts.map((product) => (
                    <Product
                      key={product.id}
                      id={product.id}
                      title={product.title}
                      price={product.price}
                      description={product.description}
                      category={product.category}
                      image={product.image || product.thumbnail} 
                      // এখানে rating প্রপসটি যোগ করা হয়েছে যা কন্ট্রোল করবে স্টার সংখ্যা
                      rating={product.rating} 
                    />
                  ))}
                </div>
              </main>
            } />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/login" element={<Login />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/payment" element={
              <Elements stripe={promise}>
                <Payment />
              </Elements>
            } />
            <Route path="/admin" element={<Admin />}/>
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}