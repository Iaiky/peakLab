// exportFirestore.mjs
import admin from "firebase-admin";
import { readFileSync, writeFileSync } from "fs";

const serviceAccount = JSON.parse(readFileSync("./serviceAccountKey.json", "utf8"));
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

const db = admin.firestore();

async function exportDB() {
  const collections = ["produits", "Commandes", "MouvementsStock", "Groupes", "categories","Users"];
  const backup = {};

  for (const col of collections) {
    const snap = await db.collection(col).get();
    backup[col] = {};
    snap.forEach(doc => {
      backup[col][doc.id] = doc.data();
    });
    console.log(`✅ ${col} : ${snap.size} documents exportés`);
  }

  writeFileSync("./backup.json", JSON.stringify(backup, null, 2));
  console.log("🎉 Export terminé → backup.json");
}

exportDB();