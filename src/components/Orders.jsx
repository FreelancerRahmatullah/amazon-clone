import React, { useEffect, useState } from 'react';
import { db } from '../auth/firebase';
import { useStateValue } from '../state/StateProvider';
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

function Orders() {
  const [{ user }] = useStateValue();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (user) {
      const q = query(collection(db, "users", user?.uid, "orders"), orderBy("timestamp", "desc"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setOrders(snapshot.docs.map(doc => ({
          id: doc.id,
          data: doc.data()
        })));
      });
      return () => unsubscribe();
    }
  }, [user]);

  return (
    <div className="p-5 max-w-screen-lg mx-auto">
      <h1 className="text-2xl font-bold mb-5 border-b pb-2">Your Orders</h1>
      <div className="space-y-4">
        {orders.map(order => (
          <div key={order.id} className="bg-white p-5 border rounded-md shadow-sm">
            <p className="text-xs text-gray-500 mb-2 font-mono">Order ID: {order.id}</p>
            <p className="font-bold mb-4 text-right">Total: ${order.data.amount}</p>
            {order.data.basket.map((item, i) => (
              <div key={i} className="flex items-center space-x-4 border-b py-2">
                <img src={item.image} className="h-14 w-14 object-contain" alt="" />
                <p className="text-sm font-medium">{item.title}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Orders;