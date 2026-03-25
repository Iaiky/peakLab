import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { collection, query, orderBy, limit, getDocs, where } from "firebase/firestore";
import { db } from "../firebase/config";

export function useCustomers(pageSize = 10) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [customers, setCustomers] = useState([]); // Clients affichés sur la page
  const [allFetched, setAllFetched] = useState([]); // Stock complet pour la logique de pagination
  const [loading, setLoading] = useState(true);
  const [hasNext, setHasNext] = useState(false);

  // Synchronisation avec l'URL
  const page = Number(searchParams.get("page")) || 1;
  const activeSearch = searchParams.get("search") || "";
  
  // État local pour l'input de recherche (pour éviter de filtrer à chaque lettre tapée)
  const [searchInput, setSearchInput] = useState(activeSearch);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const colRef = collection(db, "Users"); // Ta collection d'utilisateurs
      
      let constraints = [orderBy("displayName")];

      // Filtre Recherche (par préfixe sur le nom)
      // Note : Firebase est sensible à la casse (Case Sensitive)
      if (activeSearch) {
        constraints = [
          where("displayName", ">=", activeSearch),
          where("displayName", "<=", activeSearch + "\uf8ff"),
          orderBy("displayName")
        ];
      }

      // Pagination logique (on récupère assez de docs pour couvrir toutes les pages jusqu'à la suivante)
      const totalToFetch = page * pageSize + 1;
      constraints.push(limit(totalToFetch));

      const snapshot = await getDocs(query(colRef, ...constraints));
      const items = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.displayName || "Sans nom",
          email: data.email || "Pas d'email",
          photoURL: data.photoURL || data.avatar,
          joinDate: data.createdAt?.toDate().toLocaleDateString('fr-FR') || "N/A",
          totalOrders: data.totalOrders || 0,
          totalSpent: data.totalSpent || 0,
          ...data
        };
      });

      const startIndex = (page - 1) * pageSize;
      const currentPageData = items.slice(startIndex, startIndex + pageSize);

      setCustomers(currentPageData);
      setAllFetched(items);
      setHasNext(items.length > startIndex + pageSize);
    } catch (error) {
      console.error("Erreur useCustomers:", error);
    } finally {
      setLoading(false);
    }
  };

  // Déclenchement au changement d'URL
  useEffect(() => {
    loadCustomers();
    setSearchInput(activeSearch);
  }, [page, activeSearch]);

  // Actions
  const handleSearch = () => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (searchInput) {
      params.set("search", searchInput);
    } else {
      params.delete("search");
    }
    setSearchParams(params);
  };

  const setPage = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    setSearchParams(params);
  };

  const handleReset = () => {
    setSearchParams({});
    setSearchInput("");
  };

  return {
    customers,
    loading,
    page,
    hasNext,
    setPage,
    searchInput,
    setSearchInput,
    handleSearch,
    handleReset,
    activeSearch
  };
}