import { useState } from 'react';

export default function AdminOrderCard({ order, onUpdateStatus, onEdit }) {
  const [discountPercent, setDiscountPercent] = useState(0);

  const subtotal = order.items.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const finalTotal = subtotal - discountAmount;

  const statusStyles = {
    "En attente": "bg-orange-100 text-orange-600 border-orange-200",
    "Payé": "bg-blue-100 text-blue-600 border-blue-200",
    "Livré": "bg-green-100 text-green-600 border-green-200"
  };

  return (
    <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      
      {/* HEADER : Réadapté pour mobile */}
      <div className="bg-slate-50/50 px-4 md:px-8 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 gap-4">
        <div className="flex items-center gap-4 md:gap-6 w-full sm:w-auto">
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-secondary uppercase tracking-widest">ID</span>
            <span className="font-black text-primary text-sm md:text-base">{order.id}</span>
          </div>
          <div className="h-8 w-[1px] bg-slate-200 hidden sm:block"></div>
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-secondary uppercase tracking-widest">Client</span>
            <span className="font-bold text-slate-900 text-sm md:text-base">{order.customer}</span>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0">
          <span className="text-[10px] md:text-xs font-medium text-slate-400">{order.date}</span>
          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${statusStyles[order.status]}`}>
            {order.status}
          </span>
        </div>
      </div>

      {/* BODY : Items */}
      <div className="p-4 md:p-8">
        <div className="space-y-4 mb-6">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between items-start group">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-slate-50 flex-shrink-0 flex items-center justify-center text-[10px] font-black text-slate-500 group-hover:bg-primary/10 transition-colors">
                  {item.qty}x
                </div>
                <span className="text-xs md:text-sm font-semibold text-slate-700 leading-tight">{item.name}</span>
              </div>
              <span className="text-xs md:text-sm font-bold text-slate-900 whitespace-nowrap">{(item.price * item.qty).toLocaleString()} Ar</span>
            </div>
          ))}
        </div>

        {/* RÉDUCTION */}
        <div className="pt-4 border-t border-dashed border-slate-100 mb-6 space-y-3">
           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div className="flex items-center gap-3">
                <span className="text-[9px] font-black uppercase text-secondary tracking-widest">Remise %</span>
                <input 
                  type="number"
                  min="0" max="100"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(Math.min(100, Math.max(0, Number(e.target.value))))}
                  disabled={order.status !== 'En attente'}
                  className="w-14 bg-slate-50 border-none rounded-lg px-2 py-1 text-xs font-black text-primary text-center focus:ring-1 focus:ring-primary/20 disabled:opacity-50"
                />
              </div>
              {discountPercent > 0 && (
                <span className="text-[10px] md:text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded-md">
                  -{discountAmount.toLocaleString()} Ar ({discountPercent}%)
                </span>
              )}
           </div>
        </div>

        {/* FOOTER : Actions empilées sur mobile */}
        <div className="flex flex-col-reverse lg:flex-row justify-between items-stretch lg:items-center pt-6 border-t border-slate-50 gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button 
              onClick={() => onUpdateStatus(order.id, 'Payé')}
              disabled={order.status !== 'En attente'}
              className="bg-primary text-white p-3 lg:px-5 lg:py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-wider disabled:opacity-20"
            >
              💳 Payé
            </button>
            <button 
              onClick={() => onUpdateStatus(order.id, 'Livré')}
              disabled={order.status !== 'Payé'}
              className="bg-green-600 text-white p-3 lg:px-5 lg:py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-wider disabled:opacity-20"
            >
              📦 Livré
            </button>
            <button 
              onClick={() => onEdit(order)}
              disabled={order.status !== 'En attente'}
              className="bg-slate-100 text-secondary p-3 lg:px-5 lg:py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-wider disabled:opacity-40"
            >
              ✏️ Modifier
            </button>
          </div>

          <div className="text-right border-b lg:border-none pb-4 lg:pb-0">
            <p className="text-[9px] font-black text-secondary uppercase tracking-widest mb-1">Total Final</p>
            <p className="text-xl md:text-2xl font-black text-slate-900">{finalTotal.toLocaleString()} Ar</p>
          </div>
        </div>
      </div>
    </div>
  );
}