import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import SubHeader from "./components/SubHeader"; // নতুন ইমপোর্ট
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
import Register from "./components/Register";
import ProductDetails from "./components/ProductDetails";

const promise = loadStripe("pk_test_51TPifFQj9SEskcsf2CVHpqPl3Sf6aIusdlZotUFgYkx0g56kih7Cv5ko443svyBjNyO6OY1XPsA3s4IzMyYy7afn00Ait0z3Re");

export default function App() {
  const [dbProducts, setDbProducts] = useState([]); 
  const [apiProducts, setApiProducts] = useState([]); 
  const [searchTerm, setSearchTerm] = useState(""); 
  const [categoryTerm, setCategoryTerm] = useState(""); // ক্যাটাগরি স্টেট
  const [{}, dispatch] = useStateValue();

  // 1. Firebase Products Fetch
  useEffect(() => {
    const q = query(collection(db, "products"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setDbProducts(snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        source: 'db' 
      })));
    }, (error) => console.error("Firebase Error:", error));
    
    return () => unsubscribe();
  }, []);

  // 2. API Products Fetch
  useEffect(() => {
    fetch("https://dummyjson.com/products") 
      .then((res) => res.json())
      .then((data) => setApiProducts(data.products.map(p => ({...p, source: 'api'}))))
      .catch((err) => console.error("API Error:", err));
  }, []);

  // 3. Auth Listener
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

  // সার্চ এবং ক্যাটাগরি ফিল্টার লজিক
  const filteredProducts = allProducts.filter((product) => {
    const matchesSearch = product.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryTerm === "" || product.category?.toLowerCase() === categoryTerm.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <Router>
      <div className="bg-gray-100 min-h-screen flex flex-col">
        <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        
        {/* ক্যাটাগরি বার যুক্ত করা হলো */}
        <SubHeader setCategoryTerm={setCategoryTerm} />

        <div className="flex-grow">
          <Routes>
            <Route path="/" element={
              <main className="max-w-screen-2xl mx-auto">
                <Banner />
                <div className="grid grid-flow-row-dense md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mx-auto px-4 md:-mt-40 z-30 relative gap-5 pb-10">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <Product
                        key={`${product.source}-${product.id}`}
                        id={product.id}
                        title={product.title}
                        price={product.price}
                        description={product.description}
                        category={product.category}
                        image={product.image || product.thumbnail || product.images?.[0]} 
                        rating={product.rating} 
                      />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-20 bg-white m-5 rounded-lg shadow-sm border border-gray-200">
                      <p className="text-xl font-medium text-gray-500">
                        No products found {categoryTerm && `in "${categoryTerm}"`} {searchTerm && `matching "${searchTerm}"`}
                      </p>
                    </div>
                  )}
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
            <Route path="/register" element={<Register />}/>
            <Route path="/product/:id" element={<ProductDetails allProducts={allProducts} />}/>
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}