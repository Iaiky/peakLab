import { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs, addDoc, deleteDoc, updateDoc, doc } from 'firebase/firestore';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [newCat, setNewCat] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. LIRE : Charger les catégories depuis Firebase
  const fetchCategories = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "categories"));
      const items = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCategories(items);
      setLoading(false);
    } catch (error) {
      console.error("Erreur chargement:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // 2. CRÉER : Ajouter une catégorie
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newCat.trim()) return;

    try {
      await addDoc(collection(db, "categories"), {
        Nom: newCat, // On garde "Nom" avec majuscule pour être cohérent avec tes produits
        count: 0
      });
      setNewCat("");
      fetchCategories(); // Rafraîchir la liste
    } catch (error) {
      alert("Erreur lors de l'ajout");
    }
  };

  // 3. SUPPRIMER
  const handleDelete = async (id) => {
    if (window.confirm("Supprimer cette catégorie ?")) {
      try {
        await deleteDoc(doc(db, "categories", id));
        setCategories(categories.filter(c => c.id !== id));
      } catch (error) {
        alert("Erreur de suppression");
      }
    }
  };

  // 4. MODIFIER (UPDATE)
  const handleEdit = async (id, newName) => {
    if (!newName.trim()) {
        setEditingId(null);
        return;
    }

    try {
      const catRef = doc(db, "categories", id);
      await updateDoc(catRef, { Nom: newName });
      
      setCategories(categories.map(c => c.id === id ? { ...c, Nom: newName } : c));
      setEditingId(null);
    } catch (error) {
      alert("Erreur de modification");
    }
  };

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen pt-12 md:pt-8">
      <div className="w-full">
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 mb-6 md:mb-8 uppercase tracking-tighter">
          Gestion des <span className="text-primary">Catégories</span>
        </h1>

        <form onSubmit={handleAdd} className="bg-white p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-3 md:gap-4 mb-8 md:mb-10">
          <input 
            type="text" 
            placeholder="Nom de la catégorie..."
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
            className="flex-1 bg-slate-50 border-none rounded-xl md:rounded-2xl px-4 md:px-6 py-3 md:py-4 text-sm focus:ring-2 focus:ring-primary outline-none"
          />
          <button className="bg-primary text-white px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-black uppercase text-[10px] md:text-xs tracking-widest hover:bg-primary/90 transition-all active:scale-95">
            Ajouter +
          </button>
        </form>

        <div className="bg-transparent md:bg-white md:rounded-[2.5rem] md:shadow-sm md:border md:border-slate-100 overflow-hidden">
          {loading ? (
            <div className="p-10 text-center text-slate-400 font-bold">Chargement...</div>
          ) : (
            <>
              {/* --- VUE MOBILE : CARDS (Simple et efficace) --- */}
              <div className="grid grid-cols-1 gap-3 md:hidden">
                {categories.map((cat) => (
                  <div key={cat.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      {editingId === cat.id ? (
                        <input 
                          autoFocus
                          defaultValue={cat.Nom}
                          onBlur={(e) => handleEdit(cat.id, e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleEdit(cat.id, e.target.value)}
                          className="bg-slate-50 border border-primary/20 rounded-lg px-2 py-1 font-bold text-primary outline-none w-full"
                        />
                      ) : (
                        <div>
                          <p className="font-bold text-slate-800 truncate">{cat.Nom}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">{cat.count || 0} articles</p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1 ml-4">
                      <button onClick={() => setEditingId(cat.id)} className="p-2 bg-slate-50 text-slate-400 rounded-xl">✏️</button>
                      <button onClick={() => handleDelete(cat.id)} className="p-2 bg-red-50 text-red-400 rounded-xl">🗑️</button>
                    </div>
                  </div>
                ))}
              </div>

              {/* --- VUE DESKTOP : TABLEAU (Affiché à partir de md) --- */}
              <div className="hidden md:block">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50/50 text-secondary text-[10px] uppercase font-black tracking-widest">
                    <tr>
                      <th className="px-8 py-5">Nom de la catégorie</th>
                      <th className="px-6 py-5 text-center">Volume</th>
                      <th className="px-8 py-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {categories.map((cat) => (
                      <tr key={cat.id} className="hover:bg-slate-50/80 transition-colors group">
                        <td className="px-8 py-5">
                          {editingId === cat.id ? (
                            <input 
                              autoFocus
                              defaultValue={cat.Nom}
                              onBlur={(e) => handleEdit(cat.id, e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleEdit(cat.id, e.target.value)}
                              className="bg-white border border-primary/20 rounded-lg px-3 py-1.5 font-bold text-primary outline-none"
                            />
                          ) : (
                            <span className="font-bold text-slate-700 group-hover:text-primary transition-colors">{cat.Nom}</span>
                          )}
                        </td>
                        <td className="px-6 py-5 text-center">
                          <span className="bg-slate-100 text-slate-500 text-[10px] font-black px-3 py-1 rounded-full uppercase">
                            {cat.count || 0} articles
                          </span>
                        </td>
                        <td className="px-8 py-5 text-right space-x-2">
                          <button onClick={() => setEditingId(cat.id)} className="p-2 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-xl transition-all">✏️</button>
                          <button onClick={() => handleDelete(cat.id)} className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-xl transition-all">🗑️</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}