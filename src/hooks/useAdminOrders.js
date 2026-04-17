import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  limit, 
  Timestamp,
  doc,
  writeBatch,
  increment,
  runTransaction,
  serverTimestamp
} from "firebase/firestore";
import { db } from "../firebase/config";
import Swal from 'sweetalert2';

export function useAdminOrders(pageSize = 10) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasNext, setHasNext] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  // --- PARAMÈTRES DE L'URL ---
  const page = Number(searchParams.get("page")) || 1;
  const activeStatus = searchParams.get("status") || "en_attente";
  const activeSearch = searchParams.get("search") || "";
  const activeStart = searchParams.get("start") || "";
  const activeEnd = searchParams.get("end") || "";

  // --- ÉTATS LOCAUX POUR INPUTS (Liaison bidirectionnelle) ---
  const [searchInput, setSearchInput] = useState(activeSearch);
  const [startDate, setStartDate] = useState(activeStart);
  const [endDate, setEndDate] = useState(activeEnd);

  // --- ACTIONS ---

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (searchInput) params.set("search", searchInput); else params.delete("search");
    if (startDate) params.set("start", startDate); else params.delete("start");
    if (endDate) params.set("end", endDate); else params.delete("end");
    setSearchParams(params);
  };

  const handleReset = () => {
    setSearchInput("");
    setStartDate("");
    setEndDate("");
    setSearchParams({ status: activeStatus }); // On garde juste le statut actif
  };

  const setPage = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", newPage);
    setSearchParams(newParams);
  };

  const updateStatusFilter = (newStatus) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("status", newStatus);
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  // --- LOGIQUE DE RÉCUPÉRATION ---

  const loadData = async () => {
    setLoading(true);
    try {
      const colRef = collection(db, "Commandes");
      
      // Filtres de base Firestore (Statut + Tri Date)
      let constraints = [
        where("statut", "==", activeStatus),
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

      // Pagination : on récupère assez de docs pour couvrir la page actuelle + 1
      const totalToFetch = page * pageSize + 1;
      constraints.push(limit(totalToFetch));

      const snapshot = await getDocs(query(colRef, ...constraints));
      
      let allDocs = snapshot.docs.map(doc => {
        const data = doc.data();
        const jsDate = data.date?.toDate ? data.date.toDate() : new Date();
        
        return {
          id: doc.id,
          ...data,
          // On convertit pour éviter l'erreur d'objet React child
          date: jsDate.toISOString(), 
          dateFormatted: jsDate.toLocaleDateString("fr-FR", {
            day: '2-digit', month: 'short', year: 'numeric'
          })
        };
      });

      // Filtre de recherche textuelle hybride (ID, Client, Produits)
      if (activeSearch) {
        const s = activeSearch.toLowerCase();
        
        allDocs = allDocs.filter(order => {
            // 1. Check ID de commande
            const matchId = order.id.toLowerCase().includes(s);
            
            // 2. Check Nom du client (différentes structures possibles)
            const matchClient = 
            order.nomClient?.toLowerCase().includes(s) || 
            order.client?.nom?.toLowerCase().includes(s);
            
            // 3. Check Produits à l'intérieur de la commande
            // On vérifie dans 'items' ou 'panier' selon ce qui existe
            const itemsList = order.items || order.panier || [];
            const matchProducts = itemsList.some(item => 
            (item.nom || item.name || "").toLowerCase().includes(s)
            );

            return matchId || matchClient || matchProducts;
        });
        }

      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      
      setOrders(allDocs.slice(startIndex, endIndex));
      setHasNext(allDocs.length > endIndex);

    } catch (error) {
      console.error("Erreur hook AdminOrders:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- ACTION : VALIDER LE PAIEMENT & RÉDUIRE LE STOCK ---
  const markAsPaid = async (order, discountPercent = 0) => {
    const appliedDiscount = Number(discountPercent) || 0;
    try {
      await runTransaction(db, async (transaction) => {
        const orderRef = doc(db, "Commandes", order.id);
        const items = order.items || order.panier || [];

        // --- 1. TOUTES LES LECTURES ---
        const orderSnap = await transaction.get(orderRef);
        if (!orderSnap.exists()) throw "La commande n'existe pas.";
        if (orderSnap.data().statut === "paye") throw "Déjà payée.";

        // --- CALCUL DU TOTAL FINAL ---
        const subtotal = items.reduce((acc, item) => 
          acc + ((item.prixUnitaire || item.price || 0) * item.qty), 0
        );
        const discountAmount = (subtotal * appliedDiscount) / 100;
        const finalTotal = subtotal - discountAmount;

        const productUpdates = [];
        for (const item of items) {
          const productRef = doc(db, "produits", item.id);
          const productSnap = await transaction.get(productRef);
          
          if (!productSnap.exists()) throw `Produit "${item.nom}" introuvable.`;
          
          const currentData = productSnap.data();
          const currentStock = currentData.Stock || 0;

          // ✅ Vérification que le stock réel est suffisant
          if (item.qty > currentStock) {
            throw `Stock insuffisant pour "${item.nom}". Stock réel : ${currentStock}`;
          }

          productUpdates.push({
            ref: productRef,
            data: currentData,
            qty: item.qty,
            newStock: currentStock - item.qty
          });
        }

        // --- 2. TOUTES LES ÉCRITURES ---
        
        // A. Mise à jour de la commande
        transaction.update(orderRef, { 
          statut: "paye",
          remise: appliedDiscount,     // On enregistre le % de remise
          totalFinal: finalTotal,
          paidAt: serverTimestamp()
        });

        // B. Mise à jour des stocks et création des mouvements
        for (const p of productUpdates) {
          // Mise à jour du stock produit
          transaction.update(p.ref, { 
            Stock: p.newStock,
            // ✅ Resynchronise stockDisponible = nouveau Stock réel
            // (au cas où il y aurait eu un écart entre réservations et stock)
            stockDisponible: p.newStock
          });

          // Création du mouvement de stock (Sortie)
          // On génère une nouvelle réf de document pour MouvementsStock
          const movementRef = doc(collection(db, "MouvementsStock"));
          
          transaction.set(movementRef, {
            Produit: p.data.Nom || p.data.nom || "Inconnu",
            ProductId: p.ref.id,
            IdGroupe: p.data.IdGroupe || null, // Récupéré du snapshot produit
            IdCategorie: p.data.IdCategorie || null, // Récupéré du snapshot produit
            Quantite: p.qty,
            PrixUnitaire: p.data.PrixVente || p.data.prix || 0,
            Motif: `Commande #${order.id}`, // L'ID de la commande
            TypeMouvement: "Sortie",
            DateAjout: serverTimestamp()
          });
        }
      });

      Swal.fire({
        title: 'Succès',
        text: `La commande a été validée avec une remise de ${appliedDiscount}%`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });

      loadData();

    } catch (error) {
      console.error("Erreur Transaction:", error);
      Swal.fire({ title: 'Erreur', text: error.toString(), icon: 'error' });
    }
  };

  // --- ACTION : ANNULER/REFUSER & RESTITUER LE stockDisponible ---
  const cancelOrder = async (order) => {
    try {
      await runTransaction(db, async (transaction) => {
        const orderRef = doc(db, "Commandes", order.id);
        const items = order.items || order.panier || [];

        // --- 1. TOUTES LES LECTURES ---
        const orderSnap = await transaction.get(orderRef);
        if (!orderSnap.exists()) throw "La commande n'existe pas.";
        if (orderSnap.data().statut !== "en_attente") throw "Seules les commandes en attente peuvent être annulées.";

        const productRefs = items.map(item => doc(db, "produits", item.id));
        const productSnaps = await Promise.all(productRefs.map(ref => transaction.get(ref)));

        // --- 2. TOUTES LES ÉCRITURES ---

        // A. Mise à jour statut commande
        transaction.update(orderRef, {
          statut: "annule",
          cancelledAt: serverTimestamp()
        });

        // B. Restitution du stockDisponible pour chaque produit
        for (let i = 0; i < items.length; i++) {
          if (!productSnaps[i].exists()) continue;
          const currentStock = productSnaps[i].data().stockDisponible || 0;
          transaction.update(productRefs[i], {
            stockDisponible: currentStock + items[i].qty
          });
        }
      });

      Swal.fire({
        title: 'Commande annulée',
        text: 'Le stock disponible a été restitué.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });

      loadData();

    } catch (error) {
      console.error("Erreur annulation:", error);
      Swal.fire({ title: 'Erreur', text: error.toString(), icon: 'error' });
    }
  };

  useEffect(() => {
    loadData();
    // Synchro des inputs si l'URL change
    setSearchInput(activeSearch);
    setStartDate(activeStart);
    setEndDate(activeEnd);
  }, [searchParams]);

  return {
    orders,
    loading,
    page,
    hasNext,
    setPage,
    activeStatus,
    updateStatusFilter,
    searchInput, setSearchInput,
    startDate, setStartDate,
    endDate, setEndDate,
    handleSearch,
    handleReset,
    markAsPaid,
    cancelOrder,
    loadData
  };
}