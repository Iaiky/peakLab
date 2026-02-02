import { useState } from 'react';
import allProducts from "../../assets/products";

export default function AdminEditOrderModal({ order, isOpen, onClose, onSave }) {
  const [items, setItems] = useState([...order.items]);

  if (!isOpen) return null;

  const updateQty = (id, delta) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
    ));
  };

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const addNewProduct = (e) => {
    const prodId = parseInt(e.target.value);
    const product = allProducts.find(p => p.id === prodId);
    
    if (product && !items.find(i => i.id === prodId)) {
      setItems([...items, { id: product.id, name: product.name, qty: 1, price: product.price }]);
    }
    e.target.value = "";
  };

  const total = items.reduce((acc, item) => acc + (item.price * item.qty), 0);

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-0 md:p-6">
      {/* Overlay - click to close */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Modal Container: Fullscreen on mobile, rounded on desktop */}
      <div className="relative bg-white w-full max-w-2xl h-full md:h-auto md:max-h-[90vh] md:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header - Fixed height */}
        <div className="p-5 md:p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tighter">Édition</h2>
            <p className="text-secondary text-[10px] font-bold uppercase tracking-widest leading-tight">{order.id} — {order.customer}</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">✕</button>
        </div>

        {/* Scrollable List */}
        <div className="p-4 md:p-8 overflow-y-auto flex-1 space-y-4 bg-white">
          <label className="text-[10px] font-black uppercase text-secondary tracking-widest px-1 block mb-2">Articles commandés</label>
          
          {items.map((item) => (
            <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100 gap-4">
              <div className="flex-1">
                <p className="font-bold text-slate-900 text-sm md:text-base">{item.name}</p>
                <p className="text-[10px] md:text-xs text-primary font-black uppercase tracking-wider">{item.price} Ar / unité</p>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 md:gap-6 border-t sm:border-t-0 pt-3 sm:pt-0">
                <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
                  <button onClick={() => updateQty(item.id, -1)} className="w-8 h-8 flex items-center justify-center font-bold text-slate-400 hover:text-primary transition-colors">-</button>
                  <span className="font-black text-sm w-4 text-center">{item.qty}</span>
                  <button onClick={() => updateQty(item.id, 1)} className="w-8 h-8 flex items-center justify-center font-bold text-slate-400 hover:text-primary transition-colors">+</button>
                </div>
                <div className="min-w-[80px] text-right font-black text-slate-900 text-sm">
                  {item.price * item.qty} Ar
                </div>
                <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-600 p-2 bg-red-50 rounded-lg transition-colors">
                  🗑️
                </button>
              </div>
            </div>
          ))}

          <div className="pt-2">
            <select 
              onChange={addNewProduct}
              className="w-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-4 text-xs md:text-sm font-bold text-secondary focus:border-primary focus:ring-0 transition-colors cursor-pointer appearance-none"
            >
              <option value="">+ Ajouter un produit...</option>
              {allProducts.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.price} Ar)</option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer - Always visible, fixed height */}
        <div className="p-5 md:p-8 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-center sm:text-left w-full sm:w-auto">
            <p className="text-[9px] font-black text-secondary uppercase tracking-widest">Nouveau Total</p>
            <p className="text-2xl md:text-3xl font-black text-primary leading-none">{total.toLocaleString()} Ar</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button 
              onClick={onClose} 
              className="flex-1 sm:flex-none px-6 py-4 rounded-xl md:rounded-2xl font-bold text-secondary text-xs uppercase tracking-widest hover:bg-slate-200 transition"
            >
              Annuler
            </button>
            <button 
              onClick={() => onSave(order.id, items, total)}
              className="flex-[2] sm:flex-none px-6 md:px-10 py-4 rounded-xl md:rounded-2xl font-bold text-white text-xs uppercase tracking-widest bg-primary shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
            >
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}