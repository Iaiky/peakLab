import { useState } from 'react';
import { db, auth, storage } from '../firebase/config';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Swal from 'sweetalert2';

export function useUpdateProfile() {
  const [loading, setLoading] = useState(false);

  const updateUserData = async (uid, newData, imageFile) => {
    setLoading(true);
    try {
      let finalPhotoURL = newData.photoURL;

      // 1. Upload Image si nouveau fichier
      if (imageFile) {
        const storageRef = ref(storage, `avatars/${uid}`);
        await uploadBytes(storageRef, imageFile);
        finalPhotoURL = await getDownloadURL(storageRef);
      }

      // 2. Update Firebase Auth (le compte global)
      await updateProfile(auth.currentUser, {
        displayName: newData.displayName,
        photoURL: finalPhotoURL
      });

      // 3. Update Firestore (ta base de données Users)
      const userRef = doc(db, "Users", uid);
      await updateDoc(userRef, {
        firstName: newData.firstName,
        lastName: newData.lastName,
        displayName: newData.displayName,
        phone: newData.phone,
        photoURL: finalPhotoURL,
        avatar: finalPhotoURL, // on garde les deux clés pour la compatibilité
        updatedAt: new Date()
      });

      Swal.fire({ icon: 'success', title: 'Profil mis à jour !', timer: 1500, showConfirmButton: false });
      return finalPhotoURL;

    } catch (error) {
      console.error(error);
      Swal.fire('Erreur', 'Erreur lors de la mise à jour', 'error');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { updateUserData, loading };
}