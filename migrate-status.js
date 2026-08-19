const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, updateDoc, doc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function migrate() {
  const collections = ["properties", "attractions", "gallery"];
  
  for (const collName of collections) {
    console.log(`Migrating ${collName}...`);
    const q = collection(db, collName);
    const snap = await getDocs(q);
    
    for (const d of snap.docs) {
      if (!d.data().status) {
        await updateDoc(doc(db, collName, d.id), { status: "approved" });
        console.log(`Updated ${collName}/${d.id}`);
      }
    }
  }
  console.log("Migration complete.");
  process.exit(0);
}

migrate();
