import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { db } from '../firebase/config';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  limit, 
  Timestamp 
} from 'firebase/firestore';

export function useUserOrders(userId, pageSize = 5) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasNext, setHasNext] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Paramètres de l'URL
  const page = Number(searchParams.get("page")) || 1;
  const activeSearch = searchParams.get("search") || "";
  const activeStart = searchParams.get("start") || "";
  const activeEnd = searchParams.get("end") || "";

  // États locaux pour les inputs (Liaison bidirectionnelle)
  const [searchInput, setSearchInput] = useState(activeSearch);
  const [startDate, setStartDate] = useState(activeStart);
  const [endDate, setEndDate] = useState(activeEnd);

  // --- ACTIONS ---

  const handleSearch = () => {
    const params = { page: 1 }; 
    if (searchInput) params.search = searchInput;
    if (startDate) params.start = startDate;
    if (endDate) params.end = endDate;
    setSearchParams(params);
  };

  const handleReset = () => {
    setSearchInput("");
    setStartDate("");
    setEndDate("");
    setSearchParams({});
  };

  const setPage = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", newPage);
    setSearchParams(newParams);
  };

  // --- LOGIQUE DE RÉCUPÉRATION ---

  const loadData = async (targetPage) => {
    if (!userId) return;
    setLoading(true);

    try {
      const colRef = collection(db, "Commandes");
      
      // Contrainte obligatoire : l'ID du client connecté
      let constraints = [
        where("idClient", "==", userId),
        orderBy("date", "desc")
      ];

      // Filtre Date de début
      if (activeStart) {
        const d = new Date(activeStart);
        d.setHours(0, 0, 0, 0);
        constraints.push(where("date", ">=", Timestamp.fromDate(d)));
      }

      // Filtre Date de fin
      if (activeEnd) {
        const d = new Date(activeEnd);
        d.setHours(23, 59, 59, 999);
        constraints.push(where("date", "<=", Timestamp.fromDate(d)));
      }

      // Pagination : on récupère n pages + 1 élément pour le hasNext
      const totalToFetch = targetPage * pageSize + 1;
      constraints.push(limit(totalToFetch));

      const snapshot = await getDocs(query(colRef, ...constraints));
      
      let allDocs = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          // Formatage pour l'affichage
          dateFormatted: data.date?.toDate().toLocaleDateString("fr-FR", {
            day: '2-digit', month: 'short', year: 'numeric'
          })
        };
      });

      // Filtre de recherche textuelle (Côté Client car Firebase ne gère pas le "contains" sur les IDs/Produits)
      if (activeSearch) {
        const s = activeSearch.toLowerCase();
        allDocs = allDocs.filter(order => 
          order.id.toLowerCase().includes(s) || 
          order.items?.some(item => item.nom.toLowerCase().includes(s))
        );
      }

      const startIndex = (targetPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      
      setOrders(allDocs.slice(startIndex, endIndex));
      setHasNext(allDocs.length > endIndex);

    } catch (error) {
      console.error("Erreur historique client:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(page);
    setSearchInput(activeSearch);
    setStartDate(activeStart);
    setEndDate(activeEnd);
  }, [searchParams, userId]); // On recharge si l'URL ou l'utilisateur change

  return {
    orders,
    loading,
    page,
    hasNext,
    setPage,
    // Pour tes inputs
    searchInput, setSearchInput,
    startDate, setStartDate,
    endDate, setEndDate,
    handleSearch,
    handleReset
  };
}