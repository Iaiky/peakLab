import { useState } from 'react';
import { useCart } from "../context/CartContext";

export default function ProductModal({ product, isOpen, onClose }) {
  const [quantity, setQuantity] = useState(1);

  const { addToCart } = useCart();

  if (!isOpen || !product) return null;

  const handleFinalAdd = () => {
    // 3. On utilise la fonction du panier global
    addToCart(product, quantity);
    
    // Optionnel : Un petit message de succès avant de fermer
    onClose(); 
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
      {/* Overlay avec flou */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300" 
        onClick={onClose}
      ></div>

      {/* Contenu de la Modal */}
      <div className="relative bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
        
        {/* --- BOUTON FERMER (CROIX) --- */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 z-10 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-slate-500 hover:text-red-500 hover:bg-white shadow-lg transition-all active:scale-90 group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transition-transform group-hover:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Partie Gauche : Image */}
        <div className="md:w-1/2 bg-slate-50 flex items-center justify-center p-12">
          <img 
            src={product.image || "https://via.placeholder.com/400"} 
            alt={product.name}
            className="w-full h-auto object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Partie Droite : Infos & Achat */}
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary bg-primary/10 px-3 py-1 rounded-full mb-4 inline-block">
              {product.category}
            </span>
            <h2 className="text-4xl font-black text-slate-900 leading-none mb-4">{product.name}</h2>
            <p className="text-slate-500 font-medium leading-relaxed">{product.description || "Une nutrition de haute performance pour dépasser vos limites."}</p>
          </div>

          <div className="flex items-center justify-between mb-10">
            <span className="text-4xl font-black text-slate-900">{product.price.toLocaleString()}Ar</span>
            <div className="flex items-center gap-4 bg-slate-100 p-2 rounded-2xl">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm font-bold text-slate-600 hover:text-primary transition-colors"
              >
                -
              </button>
              <span className="font-black text-lg w-6 text-center">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm font-bold text-slate-600 hover:text-primary transition-colors"
              >
                +
              </button>
            </div>
          </div>

          <button 
            onClick={handleFinalAdd}
            className="w-full bg-primary text-white py-5 rounded-2xl md:rounded-[2rem] font-bold uppercase tracking-wider shadow-xl shadow-primary/25 hover:bg-primary/90 hover:shadow-primary/40 active:scale-[0.98] transition-all group"
          >
            <div className="flex items-center justify-center gap-3">
              {/* Icône avec une légère animation au survol du bouton */}
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 group-hover:translate-x-1 transition-transform" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>

              <span className="text-sm md:text-base">
                Ajouter au panier <span className="mx-2 opacity-50">|</span> {Math.round(product.price * quantity)} Ar
              </span>
            </div>
          </button>
          
          {/* <p className="text-center text-[10px] text-slate-400 mt-6 font-bold uppercase tracking-tighter">
            Livraison offerte dès 50€ d'achat • Paiement sécurisé
          </p> */}
        </div>
      </div>
    </div>
  );
}