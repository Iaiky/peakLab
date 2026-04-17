import { useState, useEffect } from "react";
import { collection, getDocs, doc, deleteDoc, updateDoc, increment, query, where } from 'firebase/firestore'
import { db, storage } from '../firebase/config'
import SidebarFilters from "../components/SidebarFilters";
import ProductCard from "../components/ProductCard";
import ProductModal from "../components/ProductModal";
import { useAdminProduct } from '../hooks/useAdminProduct';
import { useGroups } from '../hooks/useGroup';
import { useCategories } from '../hooks/useCategorie';
import PaginationHistory from "../components/history/PaginationsHistory";
import GroupTabs from "../components/GroupTabs";


export default function Shop() {

    const { groups } = useGroups();
    const { categories: allCategoriesDocs } = useCategories();

    // On utilise le même hook que l'admin (10 produits par page)
    const {
        products, 
        loading, 
        page, 
        hasNext, 
        setPage,
        searchInput, 
        setSearchInput, 
        updateFilters, 
        activeCategory, 
        activeSearch,
        activeGroup
    } = useAdminProduct(9);

    const [isModalOpen, setIsModalOpen] = useState(false);
    // 2. ÉTATS LOCAUX D'INTERFACE
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [currentGroupId, setCurrentGroupId] = useState(activeGroup || "");
    const [categories, setCategories] = useState([]);
    const [tempCategory, setTempCategory] = useState(activeCategory || "Toutes les catégories");

    // --- LOGIQUE DE SYNCHRONISATION ---

    // Mettre à jour le groupe quand les groupes sont chargés
      useEffect(() => {
        if (groups.length > 0 && !currentGroupId) {
          handleGroupChange(groups[0].id);
        }
      }, [groups]);
    
      const handleGroupChange = (groupId) => {
        setCurrentGroupId(groupId);
        // On réinitialise la catégorie quand on change de groupe pour éviter les mélanges
        updateFilters(activeSearch, "Toutes les catégories", groupId); 
      };

      // Filtrer les catégories pour le select selon le groupe actif
        const filteredCategoriesForSelect = allCategoriesDocs
            .filter(cat => cat.IdGroupe === currentGroupId)

        const getCategoryName = (idCategorie) => {
            if (!idCategorie) return "Général";
            // On cherche l'objet catégorie qui a cet ID
            const cat = allCategoriesDocs.find(c => c.id === idCategorie);
            return cat ? cat.Nom : "Général";
        };

        const getGroupName = (idGroup) => {
            if (!idGroup) return "Général";
            // On cherche l'objet group qui a cet ID
            const group = groups.find(c => c.id === idGroup);
            return group ? group.Nom : "Général";
        };

        // EFFECT 1 : Charger la liste des catégories depuis Firebase (AU DÉMARRAGE)
        useEffect(() => {
            const fetchCategories = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "categories"));
                // On extrait le champ "Nom" de chaque document
                const cats = querySnapshot.docs.map(doc => doc.data().Nom);
                setCategories(cats);
            } catch (error) {
                console.error("Erreur chargement catégories:", error);
            }
            };
            fetchCategories();
        }, []); // [] signifie : s'exécute une seule fois au chargement de la page

        // EFFECT 2 : Synchroniser les inputs locaux avec l'URL (BACK/FORWARD NAV)
        useEffect(() => {
            setSearchInput(activeSearch || "");
            setTempCategory(activeCategory || "Toutes les catégories");
        }, [activeSearch, activeCategory]);

    const handleAddToCart = (product, qty = 1) => {
        console.log(`Ajout de ${qty} ${product.name} au panier`);
        // Ta logique d'ajout au panier ici
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* 1. On retire la Navbar d'ici car elle est déjà dans App.jsx (grâce au Router) */}
            
            <main className="max-w-7xl mx-auto px-6 pt-28 pb-12">
                {/* Bouton Filtre Mobile - Visible uniquement sur petit écran */}
                <button 
                    onClick={() => setIsFilterOpen(true)}
                    className="lg:hidden mb-6 w-full flex items-center justify-center gap-2 bg-white border border-slate-200 p-4 rounded-2xl shadow-sm active:scale-95 transition-transform"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                    <span className="font-bold text-slate-700">Filtrer les produits</span>
                </button>
                

                <div className="flex gap-12">
                    {/* Sidebar Drawer */}
                    <div className={`fixed inset-0 z-[999] lg:relative lg:z-0 lg:block ${isFilterOpen ? "visible" : "hidden lg:block"}`}>
                        
                        {/* 1. L'overlay (le fond sombre) - Uniquement sur mobile */}
                        <div 
                            className={`fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity lg:hidden ${isFilterOpen ? "opacity-100" : "opacity-0"}`}
                            onClick={() => setIsFilterOpen(false)}
                        />

                        {/* 2. Le Panneau Blanc */}
                        <div className={`
                            fixed left-0 top-0 h-full w-[280px] bg-white z-[101] p-6 shadow-2xl 
                            transition-transform duration-300 transform
                            ${isFilterOpen ? "translate-x-0" : "-translate-x-full"}
                            lg:relative lg:translate-x-0 lg:w-64 lg:p-0 lg:bg-transparent lg:shadow-none lg:z-0
                        `}>
                            
                            {/* Header Mobile */}
                            <div className="flex justify-between items-center mb-8 lg:hidden">
                                <h2 className="text-xl font-black text-slate-900">Filtres</h2>
                                <button 
                                    onClick={() => setIsFilterOpen(false)}
                                    className="p-2 bg-slate-100 text-slate-500 rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Contenu scrollable (important pour les petits écrans) */}
                            <div className="h-[calc(100vh-120px)] lg:h-auto overflow-y-auto pr-2 custom-scrollbar">
                                <SidebarFilters 
                                    groups={groups}
                                    categories={filteredCategoriesForSelect}
                                    activeGroup={activeGroup}
                                    activeCategory={activeCategory}
                                    activeSearch={activeSearch}
                                    onFilterChange={(s, c, g) => updateFilters(s, c, g)}
                                />                               
                            </div>
                        </div>
                    </div>
                        
                    <div className="flex-1">

                        <div className="mb-10 space-y-6"> 
                            <div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">
                                Nos produits 
                            </h1>
                            <div className="h-1 w-12 bg-primary mt-2 rounded-full" /> {/* Petite barre d'accentuation */}
                            </div>

                            {/* GroupTabs avec une marge interne si nécessaire */}
                            <div className="pt-2">
                            <GroupTabs 
                                groups={groups} 
                                currentGroupId={currentGroupId} 
                                onGroupChange={handleGroupChange} 
                            />
                            </div>
                        </div>

                        {/* Grille */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                            {products.map((p) => (
                                /* IMPORTANT : On passe l'ID et l'objet complet. 
                                   On met le onClick sur la carte elle-même.
                                */
                                <div 
                                    key={p.id} 
                                    onClick={() => { 
                                        setSelectedProduct(p); 
                                        setIsModalOpen(true); 
                                    }}
                                >
                                    <ProductCard 
                                        id={p.id }
                                        name={p.Nom}
                                        price={p.Prix}
                                        group={getGroupName(p.IdGroupe)}
                                        category= {getCategoryName(p.IdCategorie)}
                                        stock= {p.Stock}
                                        stockDisponible= {p.stockDisponible}
                                        weight= {p.Poids} 
                                        image={p.image}                                
                                    />
                                </div>
                            ))}
                        </div>

                        {/* BARRE DE PAGINATION */}
                        {/* PAGINATION SIMPLIFIÉE */}
                        <PaginationHistory 
                            page={page}
                            hasNext={hasNext}
                            loading={loading}
                            // On affiche la pagination seulement s'il y a plus d'une page possible
                            show={!loading && (page > 1 || hasNext)} 
                            onPrev={() => setPage(page - 1)}
                            onNext={() => setPage(page + 1)}
                        />
                    </div>  
                </div>
            </main>

            <ProductModal 
                product={selectedProduct}
                isOpen={!!selectedProduct}
                onClose={() => setSelectedProduct(null)}
                onAddToCart={handleAddToCart} // Le bouton dans la modal
            />
        </div>       
    );
}