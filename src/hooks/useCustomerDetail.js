import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { 
  doc, 
  getDoc, 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  limit, 
  Timestamp 
} from "firebase/firestore";
import { db } from "../firebase/config";

export function useCustomerDetail(customerId, pageSize = 5) {
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasNext, setHasNext] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  // Paramètres de l'URL pour les commandes
  const page = Number(searchParams.get("page")) || 1;
  const activeSearch = searchParams.get("search") || "";
  const activeStart = searchParams.get("start") || "";
  const activeEnd = searchParams.get("end") || "";

  // États locaux pour les champs de saisie (inputs)
  const [searchInput, setSearchInput] = useState(activeSearch);
  const [startDate, setStartDate] = useState(activeStart);
  const [endDate, setEndDate] = useState(activeEnd);

  // --- ACTIONS ---

  const handleSearch = () => {
    const params = { page: 1 }; // On revient à la page 1 lors d'une recherche
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

  const loadData = async () => {
    if (!customerId) return;
    setLoading(true);

    try {
      // 1. Charger les infos du client (Profil)
      const userRef = doc(db, "Users", customerId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setCustomer({ id: userSnap.id, ...userSnap.data() });
      }

      // 2. Charger les commandes avec filtres
      const colRef = collection(db, "Commandes");
      let constraints = [
        where("idClient", "==", customerId),
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

      // Pagination : n pages + 1 pour le hasNext
      const totalToFetch = page * pageSize + 1;
      constraints.push(limit(totalToFetch));

      const snapshot = await getDocs(query(colRef, ...constraints));
      
      let allDocs = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          dateFormatted: data.date?.toDate().toLocaleDateString("fr-FR", {
            day: '2-digit', month: 'short', year: 'numeric'
          })
        };
      });

      // Filtre de recherche textuelle côté client (ID ou nom de produit)
      if (activeSearch) {
        const s = activeSearch.toLowerCase();
        allDocs = allDocs.filter(order => 
          order.id.toLowerCase().includes(s) || 
          order.items?.some(item => item.nom.toLowerCase().includes(s))
        );
      }

      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      
      setOrders(allDocs.slice(startIndex, endIndex));
      setHasNext(allDocs.length > endIndex);

    } catch (error) {
      console.error("Erreur hook CustomerDetail:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Synchro des inputs si l'URL change (ex: bouton retour navigateur)
    setSearchInput(activeSearch);
    setStartDate(activeStart);
    setEndDate(activeEnd);
  }, [customerId, searchParams]);

  return {
    customer,
    orders,
    loading,
    page,
    hasNext,
    setPage,
    searchInput, setSearchInput,
    startDate, setStartDate,
    endDate, setEndDate,
    handleSearch,
    handleReset,
    activeSearch
  };
}