import { useState } from 'react';
import AdminOrderCard from '../../components/admin/AdminOrderCard';
import AdminEditOrderModal from '../../components/admin/AdminEditOrderModal';

export default function AdminOrders() {
  const [orders, setOrders] = useState([
    { 
      id: "CMD-102", 
      customer: "Jean Dupont", 
      date: "23/01/2026", 
      status: "En attente", 
      items: [
        { id: 1, name: "Whey Gold", qty: 2, price: 59000 },
        { id: 2, name: "Creatine", qty: 1, price: 25000 }
      ],
      total: 143
    },
    { 
      id: "CMD-103", 
      customer: "Jean Dupont", 
      date: "23/01/2026", 
      status: "En attente", 
      items: [
        { id: 1, name: "Whey Gold", qty: 2, price: 59000 },
        { id: 2, name: "Creatine", qty: 1, price: 25000 }
      ],
      total: 143
    }
  ]);

  const [editingOrder, setEditingOrder] = useState(null);

  const handleUpdateStatus = (orderId, newStatus) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const handleSaveEdit = (orderId, newItems, newTotal) => {
    setOrders(orders.map(o => 
      o.id === orderId ? { ...o, items: newItems, total: newTotal } : o
    ));
    setEditingOrder(null);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-8">
        Validation des <span className="text-primary">Commandes</span>
      </h1>

      <div className="space-y-6">
        {orders.map(order => (
          <AdminOrderCard 
            key={order.id} 
            order={order} 
            onUpdateStatus={handleUpdateStatus}
            onEdit={(order) => setEditingOrder(order)}
          />
        ))}
      </div>

      {editingOrder && (
        <AdminEditOrderModal 
          order={editingOrder}
          isOpen={!!editingOrder}
          onClose={() => setEditingOrder(null)}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
}