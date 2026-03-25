// src/components/ProductCard.jsx
import { useCart } from "../context/CartContext";

export default function ProductCard({ id, name, price, group, category, stock, weight, image }) {
  const { addToCart } = useCart();

  // On prépare l'objet produit pour le panier
  const product = { id, name, price, group,category, weight, stock, image };

  return (
    <div className="group bg-white p-4 rounded-3xl border border-transparent hover:border-blue-100 hover:shadow-xl hover:shadow-blue-500/5 transition-all cursor-pointer">
      <div className="aspect-square w-full overflow-hidden rounded-2xl bg-slate-100 mb-4 flex items-center justify-center relative">
        <img 
          src={image || "/placeholder-produit.png"} 
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            e.target.src = "https://placehold.co/600x600?text=Image+indisponible"; // Image de secours
          }}
        />
        {/* On n'affiche le div que si weight existe et est supérieur à 0 */}
        {weight > 0 && (
          <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-bold shadow-sm">
            {weight}g
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-start gap-4"> {/* gap-4 force un espace minimum */}
          <div className="flex-1 min-w-0"> {/* min-w-0 est crucial pour que le truncate fonctionne dans un flex */}
            <p className="text-[10px] text-secondary uppercase font-bold tracking-wider truncate">
              {category}
            </p>
            <h3 className="text-slate-900 font-semibold group-hover:text-primary transition line-clamp-2 leading-snug">
              {name}
            </h3>
          </div>
          
          <div className="flex-shrink-0 text-right"> {/* flex-shrink-0 empêche le prix de s'écraser */}
            <p className="text-lg font-black text-slate-900 leading-none">
              {price.toLocaleString()}Ar
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-50">
          <span className={`text-[11px] font-black tracking-wider ${
            stock > 5 
              ? 'text-emerald-500' 
              : stock > 0 
                ? 'text-orange-500' 
                : 'text-red-500'
          }`}>
            ● {stock} en stock
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