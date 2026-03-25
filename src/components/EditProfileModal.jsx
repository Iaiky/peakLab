import { useState, useEffect } from 'react';

export default function EditProfileModal({ isOpen, onClose, user, onSave, loading }) {
  const [formData, setFormData] = useState({
    firstName: user?.firstName || user?.displayName?.split(' ')[0] || '',
    lastName: user?.lastName || user?.displayName?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phone: user?.phone || '',
    photoURL: user?.photoURL || user?.avatar || null
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(user.avatar);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || user.displayName?.split(' ')[0] || '',
        lastName: user.lastName || user.displayName?.split(' ').slice(1).join(' ') || '',
        email: user.email || '',
        phone: user?.phone || '',
        photoURL: user.photoURL || user.avatar || null
      });
      setPreviewUrl(user.photoURL || user.avatar);
    }
  }, [user]);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // On renvoie un objet propre à la fonction de sauvegarde
    const updatedData = {
      ...formData,
      displayName: `${formData.firstName} ${formData.lastName}`.trim()
    };
    onSave(updatedData, selectedFile);
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      <form 
        onSubmit={handleSubmit}
        className="relative bg-white w-full max-w-md rounded-[3rem] p-10 shadow-2xl animate-in zoom-in-95 duration-300"
      >
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
            Éditer <span className="text-primary">Profil</span>
          </h3>
          <button type="button" onClick={onClose} className="text-slate-300 hover:text-slate-600">✕</button>
        </div>

        <div className="flex flex-col items-center mb-6">
          <div className="relative w-24 h-24 group">
            <div className="w-full h-full bg-primary rounded-full border-4 border-slate-50 flex items-center justify-center text-white text-3xl font-bold overflow-hidden shadow-inner uppercase">
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <>{formData.firstName?.[0] || '?'}{formData.lastName?.[0] || ''}</>
              )}
            </div>
            
            <label className="absolute bottom-0 right-0 bg-black text-white p-2 rounded-full cursor-pointer hover:scale-110 transition-transform shadow-lg">
              <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              📸
            </label>
          </div>
          <p className="text-[10px] font-black uppercase text-secondary mt-2 tracking-widest">Changer la photo</p>
        </div>

        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-secondary tracking-widest ml-1">Prénom</label>
              <input 
                type="text" 
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary font-bold"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-secondary tracking-widest ml-1">Nom</label>
              <input 
                type="text" 
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary font-bold"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-secondary tracking-widest ml-1">Email</label>
            <input 
              type="email" 
              value={formData.email}
              disabled // L'email ne devrait généralement pas être modifiable ici
              className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm text-slate-400 font-bold"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-secondary tracking-widest ml-1">
                Téléphone
            </label>
            <div className="relative">
                <input 
                type="tel" 
                placeholder="034 00 000 00"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-14 pr-4 text-sm focus:ring-2 focus:ring-primary font-bold"
                />
            </div>
          </div>  

          <div className="pt-4">
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-primary transition-all shadow-lg disabled:bg-slate-200"
            >
              {loading ? "Enregistrement..." : "Sauvegarder"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}