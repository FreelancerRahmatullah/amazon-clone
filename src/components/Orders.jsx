import React, { useEffect, useState } from "react";
import { db } from "../auth/firebase";
import { useStateValue } from "../state/StateProvider";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { Download } from 'lucide-react'; 
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function Orders() {
  const [{ user }] = useStateValue();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (user) {
      const q = query(
        collection(db, "users", user?.uid, "orders"),
        orderBy("timestamp", "desc"),
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setOrders(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          })),
        );
      });
      return () => unsubscribe();
    }
  }, [user]);

  // ইনভয়েস ডাউনলোড ফাংশন
  const downloadInvoice = (order) => {
    try {
      const doc = new jsPDF();

      // ১. টপ ব্যানার ডিজাইন
      doc.setFillColor(23, 31, 42); 
      doc.rect(0, 0, 210, 40, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.text("AMAZON CLONE STORE", 14, 25);
      
      // ২. কাস্টমার ও অর্ডার তথ্য
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.text(`Invoice Number: ${order.id}`, 14, 50);
      
      // ডেট হ্যান্ডলিং (Firebase Timestamp handle)
      const date = order.data.timestamp?.toDate 
        ? order.data.timestamp.toDate().toLocaleDateString() 
        : new Date().toLocaleDateString();
      
      doc.text(`Order Date: ${date}`, 14, 56);
      doc.text(`Customer Email: ${user?.email}`, 14, 62);
      doc.text(`Status: ${order.data.status || 'Success'}`, 14, 68);

      // ৩. টেবিলের জন্য প্রোডাক্ট লিস্ট তৈরি
      const tableRows = order.data.basket.map(item => [
        item.title,
        `$${item.price}`
      ]);

      // ৪. টেবিল জেনারেট (jspdf-autotable)
      doc.autoTable({
        startY: 75,
        head: [['Product Name', 'Price']],
        body: tableRows,
        theme: 'grid',
        headStyles: { fillStyle: [23, 31, 42] }, // টেবিল হেডার কালার
      });

      // ৫. টোটাল অ্যামাউন্ট
      const finalY = doc.lastAutoTable.finalY || 75;
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(`Total Amount: $${order.data.amount}`, 14, finalY + 15);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text("Thank you for shopping with us!", 14, finalY + 25);

      // ৬. পিডিএফ সেভ/ডাউনলোড
      doc.save(`Invoice_${order.id.slice(0, 8)}.pdf`);

    } catch (error) {
      console.error("PDF Download Error:", error);
      alert("দুঃখিত, পিডিএফ ডাউনলোড করতে সমস্যা হচ্ছে।");
    }
  };

  return (
    <div className="p-5 max-w-screen-lg mx-auto min-h-screen">
      <h1 className="text-2xl font-bold mb-5 border-b pb-2">Your Orders</h1>
      <div className="space-y-6">
        {orders.length === 0 ? (
          <p className="text-gray-500 text-center mt-10">No orders found.</p>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="bg-white p-6 border rounded-lg shadow-sm relative">
              
              {/* ডাউনলোড বাটন */}
              <button 
                onClick={() => downloadInvoice(order)}
                className="absolute top-6 right-6 flex items-center gap-1 bg-[#f0c14b] text-black font-bold px-4 py-1.5 rounded border border-[#a88734] hover:bg-[#ddb347] transition text-xs shadow-sm"
              >
                <Download size={14} /> Download Invoice
              </button>

              <p className="text-xs text-gray-400 font-mono mb-2 uppercase">Order ID: {order.id}</p>
              <p className="font-bold text-sm mb-4">
                Total: <span className="text-lg">${order.data.amount}</span>
              </p>

              <div className="space-y-3">
                {order.data.basket.map((item, i) => (
                  <div key={i} className="flex items-center space-x-4 border-b border-gray-50 py-2 last:border-0">
                    <img src={item.image} className="h-12 w-12 object-contain" alt={item.title} />
                    <p className="text-sm text-gray-700 truncate flex-1">{item.title}</p>
                    <p className="text-sm font-bold">${item.price}</p>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Orders;
