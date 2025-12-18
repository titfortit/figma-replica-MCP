import { initializeApp } from "firebase/app";
import { getFirestore, collection, getCountFromServer } from "firebase/firestore";

// Your config
const firebaseConfig = {
    apiKey: "AIzaSyAk6YdsRPqzx7molVZojWZD43x8BwRERxo",
    authDomain: "cta-events.firebaseapp.com",
    projectId: "cta-events",
    storageBucket: "cta-events.firebasestorage.app",
    messagingSenderId: "1038194687584",
    appId: "1:1038194687584:web:b5b9f647d3db28b56b0d05",
    measurementId: "G-4G61H6MLZL"
};

// Initialize
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function checkStats() {
    console.log('🔄 Fetching stats from Firestore...');

    try {
        const coll = collection(db, "cta_clicks");
        const snapshot = await getCountFromServer(coll);

        console.log('\n📊 =================================');
        console.log(`🔥 TOTAL CTA CLICKS: ${snapshot.data().count}`);
        console.log('===================================\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error fetching stats:', error.message);
        console.log('💡 Hint: Did you enable Firestore in the Firebase Console?');
        process.exit(1);
    }
}

checkStats();
