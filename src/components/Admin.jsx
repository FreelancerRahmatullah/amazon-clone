import React, { useState, useEffect } from 'react';
import { db } from '../auth/firebase';
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy, doc, deleteDoc, getDocs, updateDoc } from "firebase/firestore";
import { Trash2, PlusCircle, DollarSign, ShoppingBag, Users, Clock, Phone, MapPin, CreditCard } from 'lucide-react';

function Admin() {
    const [product, setProduct] = useState({ title: '', price: '', image: '', category: '', description: '', rating: 5 });
    const [allProducts, setAllProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [stats, setStats] = useState({ sales: 0, ordersCount: 0, users: 0 });

    useEffect(() => {
        // ১. প্রোডাক্ট লোড করা
        onSnapshot(query(collection(db, "products"), orderBy("timestamp", "desc")), (snapshot) => {
            setAllProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        // ২. সব ইউজারের সব অর্ডার এক জায়গায় নিয়ে আসা
        const fetchAllOrders = async () => {
            const usersSnapshot = await getDocs(collection(db, "users"));
            setStats(prev => ({ ...prev, users: usersSnapshot.size }));
            
            let tempOrders = [];
            let totalAmt = 0;

            for (const userDoc of usersSnapshot.docs) {
                const ordersSnapshot = await getDocs(collection(db, "users", userDoc.id, "orders"));
                ordersSnapshot.forEach(order => {
                    const data = order.data();
                    totalAmt += data.amount;
                    tempOrders.push({
                        id: order.id,
                        userId: userDoc.id,
                        userEmail: userDoc.data().email,
                        ...data
                    });
                });
            }
            setOrders(tempOrders.sort((a, b) => b.created - a.created));
            setStats(prev => ({ ...prev, sales: totalAmt, ordersCount: tempOrders.length }));
        };

        fetchAllOrders();
    }, []);

    const updateStatus = async (userId, orderId, newStatus) => {
        try {
            await updateDoc(doc(db, "users", userId, "orders", orderId), {
                status: newStatus
            });
            alert("Order Status Updated!");
            window.location.reload(); 
        } catch (err) { alert(err.message); }
    };

    const addProduct = async (e) => {
        e.preventDefault();
        await addDoc(collection(db, "products"), { ...product, price: Number(product.price), timestamp: serverTimestamp() });
        setProduct({ title: '', price: '', image: '', category: '', description: '', rating: 5 });
        alert("Product Added!");
    };

    return (
        <div className="max-w-7xl mx-auto p-5 space-y-10 bg-gray-50 min-h-screen">
            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-green-600 p-6 rounded-xl text-white shadow-lg flex items-center justify-between">
                    <div><p className="opacity-80 text-sm font-bold uppercase">Total Revenue</p><h2 className="text-3xl font-bold">${stats.sales.toLocaleString()}</h2></div>
                    <DollarSign size={40} className="opacity-30" />
                </div>
                <div className="bg-blue-600 p-6 rounded-xl text-white shadow-lg flex items-center justify-between">
                    <div><p className="opacity-80 text-sm font-bold uppercase">Total Orders</p><h2 className="text-3xl font-bold">{stats.ordersCount}</h2></div>
                    <ShoppingBag size={40} className="opacity-30" />
                </div>
                <div className="bg-purple-600 p-6 rounded-xl text-white shadow-lg flex items-center justify-between">
                    <div><p className="opacity-80 text-sm font-bold uppercase">Total Users</p><h2 className="text-3xl font-bold">{stats.users}</h2></div>
                    <Users size={40} className="opacity-30" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Product Form */}
                <div className="lg:col-span-2 bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                    <h2 className="text-xl font-bold mb-5 flex items-center text-gray-700"><PlusCircle className="mr-2 text-yellow-500" /> Add New Product</h2>
                    <form onSubmit={addProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input className="border p-3 rounded-lg outline-none focus:border-yellow-500" placeholder="Product Title" onChange={e => setProduct({...product, title: e.target.value})} value={product.title} required />
                        <input className="border p-3 rounded-lg outline-none focus:border-yellow-500" type="number" placeholder="Price" onChange={e => setProduct({...product, price: e.target.value})} value={product.price} required />
                        <input className="border p-3 rounded-lg outline-none focus:border-yellow-500 md:col-span-2" placeholder="Image URL (Link)" onChange={e => setProduct({...product, image: e.target.value})} value={product.image} required />
                        <button className="md:col-span-2 bg-[#f0c14b] p-3 font-bold rounded-lg hover:bg-[#ddb347] transition duration-200 shadow-md">Upload Product</button>
                    </form>
                </div>

                {/* Inventory */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 overflow-y-auto h-[400px]">
                    <h2 className="font-bold border-b mb-4 pb-2 text-gray-700">Inventory Management</h2>
                    {allProducts.map(item => (
                        <div key={item.id} className="flex justify-between items-center mb-3 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition">
                            <div className="flex items-center space-x-3">
                                <img src={item.image} className="h-10 w-10 object-contain rounded bg-white" alt="" />
                                <p className="text-xs font-bold truncate w-28 text-gray-700">{item.title}</p>
                            </div>
                            <Trash2 size={18} className="text-red-500 cursor-pointer hover:scale-110 transition" onClick={async () => { if(window.confirm("Delete?")) await deleteDoc(doc(db, "products", item.id)) }} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Order Management Section */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-2xl font-bold mb-6 flex items-center text-gray-700"><Clock className="mr-2 text-blue-500" /> Order Tracking & Delivery</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-separate border-spacing-y-2">
                        <thead>
                            <tr className="bg-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                <th className="p-4 rounded-l-lg">Customer Info</th>
                                <th className="p-4 text-center">Payment</th>
                                <th className="p-4">Delivery Address</th>
                                <th className="p-4 text-center">Status</th>
                                <th className="p-4 rounded-r-lg">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.id} className="bg-white border-y border-gray-100 shadow-sm hover:shadow-md transition duration-200">
                                    <td className="p-4 border-l border-gray-100 rounded-l-lg">
                                        <p className="text-sm font-bold text-gray-800">{order.userEmail}</p>
                                        <div className="flex items-center text-[10px] text-gray-400 mt-1 uppercase">
                                            <span className="bg-gray-100 px-2 py-0.5 rounded">ID: {order.id.slice(0, 8)}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <p className="text-lg font-extrabold text-green-700">${order.amount}</p>
                                        <div className="flex items-center justify-center text-[10px] font-bold text-blue-600 mt-1">
                                            <CreditCard size={12} className="mr-1" /> {order.method || "N/A"}
                                        </div>
                                    </td>
                                    <td className="p-4 max-w-[200px]">
                                        <div className="flex items-center text-sm font-bold text-gray-700 mb-1">
                                            <Phone size={14} className="mr-1 text-green-500" /> {order.phone || "No Phone"}
                                        </div>
                                        <div className="flex items-start text-[11px] text-gray-500 leading-tight">
                                            <MapPin size={14} className="mr-1 text-red-500 shrink-0" /> {order.address || "No Address Provided"}
                                        </div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                            {order.status || 'Processing'}
                                        </span>
                                    </td>
                                    <td className="p-4 rounded-r-lg border-r border-gray-100">
                                        <select 
                                            onChange={(e) => updateStatus(order.userId, order.id, e.target.value)}
                                            className="text-xs border border-gray-300 p-2 rounded-lg bg-gray-50 font-bold outline-none cursor-pointer hover:bg-white transition"
                                        >
                                            <option value="">Update Status</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Delivered">Delivered</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Admin;