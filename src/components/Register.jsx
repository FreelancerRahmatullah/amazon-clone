import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../auth/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

function Register() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const register = (e) => {
        e.preventDefault();
        if (!name || !email || !password) return alert("সবগুলো ঘর পূরণ করুন!");

        createUserWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                // ইউজারের প্রোফাইলে নাম আপডেট করা
                await updateProfile(userCredential.user, { displayName: name });
                
                // ফায়ারস্টোরে ইউজারের তথ্য সেভ করে রাখা (ভবিষ্যতের জন্য)
                await setDoc(doc(db, "users", userCredential.user.uid), {
                    name: name,
                    email: email,
                    createdAt: new Date()
                });

                alert("অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!");
                navigate('/');
            })
            .catch(error => alert(error.message));
    };

    return (
        <div className='bg-white h-screen flex flex-col items-center pt-10'>
            <Link to='/'>
                <img className="w-24 object-contain mb-5" src='https://wikimedia.org' alt="logo" />
            </Link>

            <div className='w-80 border border-gray-300 p-6 rounded-md shadow-sm'>
                <h1 className='text-2xl font-medium mb-4'>Create Account</h1>
                <form>
                    <h5 className='text-sm font-bold mb-1'>Your Name</h5>
                    <input className='w-full border border-gray-400 p-1 mb-3 outline-none focus:ring-1 focus:ring-yellow-500 rounded-sm' type='text' value={name} onChange={e => setName(e.target.value)} placeholder="First and last name" />

                    <h5 className='text-sm font-bold mb-1'>E-mail</h5>
                    <input className='w-full border border-gray-400 p-1 mb-3 outline-none focus:ring-1 focus:ring-yellow-500 rounded-sm' type='email' value={email} onChange={e => setEmail(e.target.value)} />

                    <h5 className='text-sm font-bold mb-1'>Password</h5>
                    <input className='w-full border border-gray-400 p-1 mb-1 outline-none focus:ring-1 focus:ring-yellow-500 rounded-sm' type='password' value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 6 characters" />
                    <p className='text-[10px] text-gray-600 mb-4 italic'>! Passwords must be at least 6 characters.</p>

                    <button onClick={register} className='w-full bg-[#f0c14b] border border-[#a88734] py-1 rounded-sm shadow-sm hover:bg-[#ddb347] font-medium'>
                        Create your Amazon account
                    </button>
                </form>

                <p className='text-xs mt-4 leading-tight'>
                    By creating an account, you agree to Amazon's Conditions of Use and Privacy Notice.
                </p>

                <div className='border-t mt-4 pt-4 text-xs'>
                    Already have an account? <Link to='/login' className='text-blue-600 hover:underline'>Sign-in</Link>
                </div>
            </div>
        </div>
    );
}

export default Register;