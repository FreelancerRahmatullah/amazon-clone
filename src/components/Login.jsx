import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../auth/firebase"; // নিশ্চিত করুন এই পাথটি ঠিক আছে
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signIn = (e) => {
    e.preventDefault();
    
    // ইমেইল এবং পাসওয়ার্ড চেক
    if (!email || !password) return alert("Please enter both email and password");

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        if (userCredential) {
          navigate("/");
        }
      })
      .catch((error) => {
        // ফায়ারবেস এরর মেসেজগুলো পরিষ্কার করে দেখানো
        if (error.code === 'auth/invalid-email') alert("Incorrect email format! Please enter a correct email.");
        else if (error.code === 'auth/user-not-found') alert("There is no account at this email.");
        else if (error.code === 'auth/wrong-password') alert("The password is incorrect.");
        else alert(error.message);
      });
  };

  const register = (e) => {
    e.preventDefault();

    if (!email || !password) return alert("Enter email and password to open an account.");

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        if (userCredential) {
          navigate("/");
        }
      })
      .catch((error) => {
        if (error.code === 'auth/email-already-in-use') alert("An account has already been opened with this email.");
        else if (error.code === 'auth/weak-password') alert("The password must be at least 6 characters long.");
        else alert(error.message);
      });
  };

  return (
    <div className="bg-white h-screen flex flex-col items-center">
      <Link to="/">
        <img
          className="my-5 w-24 object-contain"
          src="/amazon.jpg"
          alt="Amazon Logo"
        />
      </Link>

      <div className="w-80 h-fit flex flex-col rounded-md border border-gray-300 p-5">
        <h1 className="font-medium text-2xl mb-5 text-gray-800">Sign-in</h1>
        
        <form>
          <h5 className="text-sm font-bold mb-1">E-mail</h5>
          <input
            className="h-8 mb-3 bg-white w-full border border-gray-400 p-2 focus:ring-1 focus:ring-yellow-500 outline-none rounded-sm"
            type="email" // 'text' এর বদলে 'email' দিন
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <h5 className="text-sm font-bold mb-1">Password</h5>
          <input
            className="h-8 mb-3 bg-white w-full border border-gray-400 p-2 focus:ring-1 focus:ring-yellow-500 outline-none rounded-sm"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            onClick={signIn}
            className="bg-[#f0c14b] hover:bg-[#ddb347] rounded-sm w-full h-8 border border-[#a88734] mt-2 font-semibold shadow-inner"
          >
            Sign In
          </button>
        </form>

        <p className="text-xs mt-4 text-gray-600 leading-tight">
          By signing-in you agree to the AMAZON CLONE Conditions of Use & Sale. 
          Please see our Privacy Notice, our Cookies Notice and our Interest-Based Ads Notice.
        </p>

        <div className="mt-5 flex items-center justify-between">
           <hr className="w-full border-gray-300" /><span className="px-2 text-xs text-gray-400 whitespace-nowrap">New to Amazon?</span><hr className="w-full border-gray-300" />
        </div>

        <button
          onClick={()=> navigate('/register')}
          className="bg-gray-100 hover:bg-gray-200 rounded-sm w-full h-8 border border-gray-400 mt-4 text-sm font-medium shadow-sm transition duration-200"
        >
          Create your Amazon Account
        </button>
      </div>
    </div>
  );
}

export default Login;