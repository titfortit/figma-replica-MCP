import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getCountFromServer } from 'firebase/firestore';

// Firebase configuration (matching the main app)
const firebaseConfig = {
    apiKey: "AIzaSyAk6YdsRPqzx7molVZojWZD43x8BwRERxo",
    authDomain: "cta-events.firebaseapp.com",
    projectId: "cta-events",
    storageBucket: "cta-events.firebasestorage.app",
    messagingSenderId: "1038194687584",
    appId: "1:1038194687584:web:b5b9f647d3db28b56b0d05",
    measurementId: "G-4G61H6MLZL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function getSignupCount() {
    try {
        const signupsRef = collection(db, 'signups');
        const snapshot = await getCountFromServer(signupsRef);
        const count = snapshot.data().count;

        console.log('\n📊 Signup Statistics');
        console.log('═══════════════════════════════');
        console.log(`Total signups: ${count}`);
        console.log('═══════════════════════════════\n');

        process.exit(0);
    } catch (error) {
        console.error('Error fetching signup count:', error);
        process.exit(1);
    }
}

getSignupCount();
