import React, { useState } from 'react';

const StockMovementModal = ({ 
  isOpen, 
  onClose, 
  movementType, 
  product, 
  quantity, 
  setQuantity, 
  unitPrice, 
  setUnitPrice, 
  comment, 
  setComment, 
  onConfirm 
}) => {

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting || isSuccess) return;

    setIsSubmitting(true);

    try {
      await onConfirm();

      // SI RÉUSSITE :
      setIsSuccess(true);
      setIsSubmitting(false);

      // On attend 1.5s pour que l'utilisateur voie le succès, puis on ferme
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1500);

    }catch(error) {
      console.error(error);
      setIsSubmitting(false);
    }finally{
      setIsSubmitting(false);
    } 
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={!isSubmitting && !isSuccess ? onClose : undefined}
      ></div>
      
      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-md rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 shadow-2xl animate-in fade-in zoom-in duration-200 overflow-y-auto max-h-[90vh] custom-scrollbar">
        <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-0.5">
          {movementType === 'IN' ? '📈 Arrivage' : '📉 Sortie'}
        </h2>

        {/* Bloc Nom + Poids regroupés */}
        <div className="flex items-center flex-wrap gap-2 mb-1">
          <p className="text-secondary text-xs md:text-sm font-bold">
            {product?.Nom || product?.name}
          </p>
          {Number(product?.Poids) > 0 && (
            <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-md font-black">
              {product.Poids}g
            </span>
          )}
        </div>

        {/* Stock actuel juste en dessous sans trop d'espace */}
        <p className="text-[10px] text-slate-400 font-bold mb-6 italic">
          Stock actuel : <span className="text-slate-900">{product?.Stock || 0} unités</span>
        </p>

        <form onSubmit={handleFormSubmit} className="space-y-4 md:space-y-5">
          
          <div className="grid grid-cols-2 gap-4">
            {/* CHAMP QUANTITÉ */}
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-secondary tracking-widest px-1">Quantité</label>
              <input 
                type="number" 
                min="1"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full bg-slate-50 border-none rounded-xl md:rounded-2xl p-3 md:p-4 focus:ring-2 focus:ring-primary font-bold text-base md:text-lg" 
              />
            </div>

            {/* CHAMP PRIX UNITAIRE */}
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-secondary tracking-widest px-1">Prix Unitaire (Ar)</label>
              <input 
                type="number" 
                min="0"
                required
                placeholder="0"
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
                className="w-full bg-slate-50 border-none rounded-xl md:rounded-2xl p-3 md:p-4 focus:ring-2 focus:ring-primary font-bold text-base md:text-lg text-primary" 
              />
            </div>
          </div>

          {/* AFFICHAGE DU TOTAL CALCULÉ */}
          {quantity > 0 && unitPrice > 0 && (
            <div className="bg-primary/5 p-3 rounded-xl border border-primary/10 flex justify-between items-center animate-in slide-in-from-top-2 duration-300">
              <span className="text-[10px] font-black uppercase text-primary tracking-widest">Valeur totale</span>
              <span className="font-black text-primary text-lg">
                {(quantity * unitPrice).toLocaleString('fr-FR')} Ar
              </span>
            </div>
          )}

          {/* CHAMP RAISON */}
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase text-secondary tracking-widest px-1">Raison / Commentaire</label>
            <textarea 
              required
              placeholder={movementType === 'IN' ? "Ex: Facture #FR-2026..." : "Ex: Vente client..."}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full bg-slate-50 border-none rounded-xl md:rounded-2xl p-3 md:p-4 focus:ring-2 focus:ring-primary h-20 md:h-24 text-sm"
            ></textarea>
          </div>

          <div className={`grid ${isSuccess ? 'grid-cols-1' : 'grid-cols-2'} gap-3 md:gap-4 pt-2`}>
            <button 
              type="submit"
              disabled={isSubmitting || isSuccess}
              className={`py-4 rounded-2xl font-bold text-sm text-white shadow-lg transition-all duration-500 transform active:scale-95 flex items-center justify-center ${
                isSuccess 
                  ? 'bg-green-500 shadow-green-200 w-full' 
                  : isSubmitting 
                    ? 'opacity-70 cursor-not-allowed bg-slate-400' 
                    : movementType === 'IN' ? 'bg-green-500 shadow-green-200' : 'bg-slate-900 shadow-slate-200'
              }`}
            >
              {/* 4. Feedback visuel pendant le chargement */}
              {isSuccess ? (
              <div className="flex items-center gap-2 animate-in zoom-in duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
                <span>Mise à jour réussie !</span>
              </div>
            ) : isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Traitement...</span>
              </div>
            ) : 'Confirmer'}
            </button>
            {!isSuccess && (
              <button 
                type="button" 
                onClick={onClose}
                disabled={isSubmitting}
                className="bg-slate-100 text-secondary py-4 rounded-2xl font-bold text-sm hover:bg-slate-200 transition disabled:opacity-50"
              >
                Annuler
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default StockMovementModal;