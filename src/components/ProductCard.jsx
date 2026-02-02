// src/components/ProductCard.jsx
import { useCart } from "../context/CartContext";

export default function ProductCard({ id, name, price, category, stock, weight }) {
  const { addToCart } = useCart();

  // On prépare l'objet produit pour le panier
  const product = { id, name, price, category, weight };

  return (
    <div className="group bg-white p-4 rounded-3xl border border-transparent hover:border-blue-100 hover:shadow-xl hover:shadow-blue-500/5 transition-all cursor-pointer">
      <div className="aspect-square w-full overflow-hidden rounded-2xl bg-slate-100 mb-4 flex items-center justify-center relative">
        <span className="text-slate-400">Photo</span>
        <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-bold shadow-sm">
          {weight} kg
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[10px] text-secondary uppercase font-bold tracking-wider">{category}</p>
            <h3 className="text-slate-900 font-semibold group-hover:text-primary transition">{name}</h3>
          </div>
          <p className="text-lg font-bold text-slate-900">{price.toLocaleString()}Ar</p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-50">
          <span className={`text-[11px] font-medium ${stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
            ● {stock > 0 ? `${stock} en stock` : 'Rupture'}
          </span>

          {/* BOUTON AJOUTER AU PANIER */}
          <button 
            disabled={stock <= 0}
            onClick={(e) => {
              e.stopPropagation(); // Empêche d'ouvrir une éventuelle modale en cliquant sur le bouton
              addToCart(product);
            }}
            className={`p-1.5 rounded-full transition-all active:scale-90 ${
              stock > 0 
              ? 'bg-slate-50 text-primary hover:bg-primary hover:text-white shadow-sm' 
              : 'bg-slate-50 text-slate-300 cursor-not-allowed'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}