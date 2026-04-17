import { useState } from 'react';
import { db, storage } from '../firebase/config'
import { doc, runTransaction, serverTimestamp } from 'firebase/firestore';
import { collection, query, where, getDocs, limit, orderBy } from 'firebase/firestore';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export function useOrder() {
  const [loading, setLoading] = useState(false);
  const { cartItems, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const createOrder = async (user) => {
    if (!user) {
      Swal.fire({
        icon: 'warning',
        title: 'Connexion requise',
        text: 'Veuillez vous connecter pour valider votre commande.',
        confirmButtonColor: '#1B456F' // Ta couleur primary
      });
      return;
    }

    if (cartItems.length === 0) return;

    setLoading(true);

    // 1. Vérification anti-spam (Doublon temporel)
    const recentOrdersQuery = query(
        collection(db, "Commandes"),
        where("idClient", "==", user.uid),
        orderBy("date", "desc"),
        limit(1)
    );

    const querySnapshot = await getDocs(recentOrdersQuery);
    if (!querySnapshot.empty) {
      const lastOrder = querySnapshot.docs[0].data();
      const lastOrderTime = lastOrder.date?.toMillis() || 0;
      const now = Date.now();

      // Si la dernière commande date de moins de 30 secondes
      if (now - lastOrderTime < 30000) {
        Swal.fire({
          icon: 'warning',
          title: 'Commande en cours',
          text: 'Une commande est déjà en cours de traitement. Patientez quelques secondes.',
          confirmButtonColor: '#1B456F'
        });
        setLoading(false);
        return;
      }
    }

    // 1. Génération d'un ID unique basé sur l'UID et le timestamp
    // Cela évite les doublons si le bouton est cliqué plusieurs fois
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0].replace(/-/g, '');
    const timeStr = now.getHours().toString().padStart(2, '0') + 
                    now.getMinutes().toString().padStart(2, '0');

    const orderId = `CMD-${dateStr}-${timeStr}-${user.uid.slice(0, 5)}`;
    const orderRef = doc(db, "Commandes", orderId);

    try {
      await runTransaction(db, async (transaction) => {
        
        // ✅ 1. Lire et vérifier le stockDisponible de chaque produit
        const produitRefs = cartItems.map(item => doc(db, "produits", item.id));
        const produitSnaps = await Promise.all(produitRefs.map(ref => transaction.get(ref)));

        for (let i = 0; i < cartItems.length; i++) {
          const item = cartItems[i];
          const snap = produitSnaps[i];

          if (!snap.exists()) {
            throw new Error(`Le produit "${item.name}" n'existe plus.`);
          }

          const stockDisponible = snap.data().stockDisponible ?? 0;

          if (item.qty > stockDisponible) {
            throw new Error(`Stock insuffisant pour "${item.name}". Disponible : ${stockDisponible}`);
          }
        }

        // ✅ 2. Déduire le stockDisponible pour chaque produit
        for (let i = 0; i < cartItems.length; i++) {
          const item = cartItems[i];
          const snap = produitSnaps[i];
          const stockDisponible = snap.data().stockDisponible;

          transaction.update(produitRefs[i], {
            stockDisponible: stockDisponible - item.qty
          });
        }

        // ✅ 3. Créer la commande
        const orderData = {
          idCommande: orderId,
          idClient: user.uid,
          date: serverTimestamp(),
          client: {
            nom: user.displayName || '',
            email: user.email
          },
          items: cartItems.map(item => ({
            id: item.id,
            nom: item.name,
            prixUnitaire: item.price,
            qty: item.qty,
            image: item.image,
            group: item.group,
            category: item.category,
            weight: item.weight || 0
          })),
          total: totalPrice,
          statut: "en_attente"
        };

        transaction.set(orderRef, orderData);
      });

      await Swal.fire({
        title: 'Commande validée !',
        text: `Votre commande ${orderId} a été enregistrée avec succès.`,
        icon: 'success',
        confirmButtonText: 'Voir mes commandes',
        confirmButtonColor: '#1B456F',
        background: '#ffffff',
        customClass: {
          popup: 'rounded-[2.5rem] border-none shadow-2xl',
          title: 'font-black text-slate-900 pt-6',
          htmlContainer: 'font-medium text-slate-500',
          confirmButton: 'rounded-2xl font-black uppercase tracking-[0.1em] text-xs px-8 py-4 mb-4'
        },
      });
      
      // Si on arrive ici, la transaction est réussie
      clearCart();
      navigate('/profile');

    } catch (error) {
      console.error("Erreur Transaction:", error);
      Swal.fire({
        icon: 'error',
        title: 'Oups...',
        text: typeof error === 'string' ? error : "Une erreur est survenue lors de la commande.",
        confirmButtonColor: '#1B456F'
      });
    } finally {
      setLoading(false);
    }
  };

  return { createOrder, loading };
}