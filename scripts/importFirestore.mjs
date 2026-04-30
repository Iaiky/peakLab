import admin from "firebase-admin";
import { readFileSync } from "fs";

const serviceAccount = JSON.parse(readFileSync("./serviceAccountKey.json", "utf8"));
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

const db = admin.firestore();

function restoreTimestamps(obj) {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'object' && '_seconds' in obj && '_nanoseconds' in obj) {
    return new admin.firestore.Timestamp(obj._seconds, obj._nanoseconds);
  }
  if (Array.isArray(obj)) return obj.map(item => restoreTimestamps(item));
  if (typeof obj === 'object') {
    const restored = {};
    for (const [key, value] of Object.entries(obj)) {
      restored[key] = restoreTimestamps(value);
    }
    return restored;
  }
  return obj;
}

// ✅ Supprime tous les documents d'une collection
async function clearCollection(col) {
  const snap = await db.collection(col).get();
  if (snap.empty) return;

  const batch = db.batch();
  let count = 0;

  for (const doc of snap.docs) {
    batch.delete(doc.ref);
    count++;
    if (count % 500 === 0) await batch.commit();
  }

  await batch.commit();
  console.log(`🗑️  ${col} vidée (${snap.size} docs supprimés)`);
}

async function importDB() {
  const backup = JSON.parse(readFileSync("./backup.json", "utf8"));

  for (const [col, docs] of Object.entries(backup)) {
    // ✅ 1. On vide d'abord la collection
    await clearCollection(col);

    // ✅ 2. Puis on réimporte depuis le backup
    const batch = db.batch();
    let count = 0;

    for (const [id, data] of Object.entries(docs)) {
      const ref = db.collection(col).doc(id);
      batch.set(ref, restoreTimestamps(data));
      count++;
      if (count % 500 === 0) {
        await batch.commit();
        console.log(`  ${count} docs importés dans ${col}...`);
      }
    }

    await batch.commit();
    console.log(`✅ ${col} : ${count} documents importés`);
  }

  console.log("🎉 Restore complet — base remise à l'état du backup !");
}

importDB();