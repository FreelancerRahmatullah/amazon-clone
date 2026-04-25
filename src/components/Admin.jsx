import React, { useState, useEffect } from 'react';
import { db } from '../auth/firebase';
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy, doc, deleteDoc } from "firebase/firestore";
import { Trash2, PlusCircle } from 'lucide-react';

function Admin() {
    const [product, setProduct] = useState({
        title: '',
        price: '',
        image: '',
        category: '',
        description: '',
        rating: 5
    });
    const [allProducts, setAllProducts] = useState([]);

    // ডেটাবেস থেকে প্রোডাক্ট লিস্ট আনা
    useEffect(() => {
        const q = query(collection(db, "products"), orderBy("timestamp", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setAllProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        return () => unsubscribe();
    }, []);

    const handleChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const addProduct = async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, "products"), {
                ...product,
                price: Number(product.price),
                rating: Number(product.rating),
                timestamp: serverTimestamp()
            });
            alert("প্রোডাক্টটি সকল তথ্যসহ সফলভাবে যুক্ত হয়েছে!");
            // ফর্ম খালি করা
            setProduct({ title: '', price: '', image: '', category: '', description: '', rating: 5 });
        } catch (err) {
            alert("Error: " + err.message);
        }
    };

    const deleteProduct = async (id) => {
        if (window.confirm("আপনি কি নিশ্চিত যে এই প্রোডাক্টটি ডিলিট করতে চান?")) {
            try {
                await deleteDoc(doc(db, "products", id));
            } catch (err) {
                alert(err.message);
            }
        }
    };

    return (
        <div className="max-w-5xl mx-auto mt-10 p-5 grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* বাম পাশ: প্রোডাক্ট অ্যাড করার ফর্ম (২ কলাম জুড়ে) */}
            <div className="lg:col-span-2 bg-white p-8 shadow-xl rounded-xl border border-gray-100 h-fit">
                <div className="flex items-center space-x-2 mb-6 border-b pb-2">
                    <PlusCircle className="text-yellow-600" />
                    <h2 className="text-2xl font-bold text-gray-800">Add New Product</h2>
                </div>

                <form onSubmit={addProduct} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-600 mb-1">Product Title</label>
                        <input name="title" className="border p-2 rounded-md outline-none focus:ring-2 focus:ring-yellow-400" placeholder="e.g. Apple iPad Pro" value={product.title} onChange={handleChange} required />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-600 mb-1">Price ($)</label>
                        <input name="price" type="number" className="border p-2 rounded-md outline-none focus:ring-2 focus:ring-yellow-400" placeholder="999" value={product.price} onChange={handleChange} required />
                    </div>

                    <div className="flex flex-col md:col-span-2">
                        <label className="text-sm font-semibold text-gray-600 mb-1">Image URL</label>
                        <input name="image" className="border p-2 rounded-md outline-none focus:ring-2 focus:ring-yellow-400" placeholder="https://media-amazon.com..." value={product.image} onChange={handleChange} required />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-600 mb-1">Category</label>
                        <input name="category" className="border p-2 rounded-md outline-none focus:ring-2 focus:ring-yellow-400" placeholder="Electronics" value={product.category} onChange={handleChange} required />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-600 mb-1">Initial Rating (1-5)</label>
                        <input name="rating" type="number" min="1" max="5" className="border p-2 rounded-md outline-none focus:ring-2 focus:ring-yellow-400" value={product.rating} onChange={handleChange} required />
                    </div>

                    <div className="flex flex-col md:col-span-2">
                        <label className="text-sm font-semibold text-gray-600 mb-1">Description</label>
                        <textarea name="description" rows="4" className="border p-2 rounded-md outline-none focus:ring-2 focus:ring-yellow-400" placeholder="Product details and features..." value={product.description} onChange={handleChange} required></textarea>
                    </div>

                    <button className="md:col-span-2 bg-[#f0c14b] hover:bg-[#ddb347] p-3 font-bold rounded-md shadow-md transition duration-200 mt-2 text-gray-800">
                        Upload Product to Home Page
                    </button>
                </form>
            </div>

            {/* ডান পাশ: প্রোডাক্ট কন্ট্রোল/ডিলিট লিস্ট (১ কলাম) */}
            <div className="bg-white p-6 shadow-xl rounded-xl border border-gray-100 h-[600px] flex flex-col">
                <h2 className="text-xl font-bold mb-4 border-b pb-2 text-gray-800">Inventory Control</h2>
                <div className="overflow-y-auto flex-1 space-y-4 pr-2 custom-scrollbar">
                    {allProducts.length === 0 ? (
                        <p className="text-gray-400 text-center mt-10">No products in database.</p>
                    ) : (
                        allProducts.map((item) => (
                            <div key={item.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
                                <div className="flex items-center space-x-3 overflow-hidden">
                                    <img src={item.image} alt="" className="h-10 w-10 object-contain bg-white rounded" />
                                    <div className="truncate">
                                        <p className="text-xs font-bold text-gray-700 truncate w-32">{item.title}</p>
                                        <p className="text-[10px] text-gray-500">${item.price}</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => deleteProduct(item.id)}
                                    className="text-red-500 hover:bg-red-100 p-2 rounded-full transition"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default Admin;