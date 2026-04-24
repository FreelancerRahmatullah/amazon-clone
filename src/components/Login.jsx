import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../auth/firebase";
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
    signInWithEmailAndPassword(auth, email, password)
      .then(() => navigate("/"))
      .catch((error) => alert(error.message));
  };

  const register = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => navigate("/"))
      .catch((error) => alert(error.message));
  };

  return (
    <div className="bg-white h-screen flex flex-col items-center">
      <Link to="/">
        <img
          className="my-5 w-24 object-contain"
          src="https://wikimedia.org"
          alt="logo"
        />
      </Link>

      <div className="w-80 h-fit flex flex-col rounded-md border border-gray-300 p-5">
        <h1 className="font-medium text-2xl mb-5">Sign-in</h1>
        <form>
          <h5 className="text-sm font-bold mb-1">E-mail</h5>
          <input
            className="h-8 mb-3 bg-white w-full border border-gray-400 p-2 focus:ring-1 focus:ring-yellow-500 outline-none"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <h5 className="text-sm font-bold mb-1">Password</h5>
          <input
            className="h-8 mb-3 bg-white w-full border border-gray-400 p-2 focus:ring-1 focus:ring-yellow-500 outline-none"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            onClick={signIn}
            className="bg-[#f0c14b] rounded-sm w-full h-8 border border-[#a88734] mt-2"
          >
            Sign In
          </button>
        </form>
        <p className="text-xs mt-4">
          By signing-in you agree to Amazon's Conditions of Use & Sale.
        </p>
        <button
          onClick={register}
          className="bg-gray-200 rounded-sm w-full h-8 border border-gray-400 mt-4"
        >
          Create your Amazon Account
        </button>
      </div>
    </div>
  );
}

export default Login;
