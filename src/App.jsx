import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import Banner from "./components/Banner";
import Product from "./components/Product";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Checkout from "./components/Checkout";
import Login from "./components/Login";
import { useStateValue } from "./state/StateProvider";
import { auth } from "./auth/firebase";

export default function App() {
  const [products, setProducts] = useState([]);
  const [{}, dispatch] = useStateValue();

  useEffect(() => {
    // ইউজারের লগইন স্টেট চেক করার জন্য
    auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        dispatch({
          type: "SET_USER",
          user: authUser,
        });
      } else {
        dispatch({
          type: "SET_USER",
          user: null,
        });
      }
    });
  }, [dispatch]); // dependency array তে dispatch যোগ করা ভালো

  useEffect(() => {
    fetch("https://dummyjson.com/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products);
      })
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  return (
    <Router>
      <div className="bg-gray-100 min-h-screen">
        <Header />
        <Routes>
          <Route
            path="/"
            element={
              <main className="max-w-screen-2xl mx-auto">
                <Banner />
                <div className="grid grid-flow-row-dense md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mx-auto">
                  {products?.map((product) => (
                    <Product
                      key={product.id}
                      id={product.id}
                      title={product.title}
                      price={product.price}
                      description={product.description}
                      category={product.category}
                      image={product.images[0]} // dummyjson এ images একটি array, তাই প্রথমটি নিন
                    />
                  ))}
                </div>
              </main>
            }
          />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} /> 
        </Routes>
      </div>
    </Router>
  );
}
