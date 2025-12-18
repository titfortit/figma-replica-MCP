import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, orderBy } from 'firebase/firestore';

// Firebase configuration
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

async function getSignupDetails() {
    try {
        console.log('\n🔄 Fetching signup details from Firestore...\n');

        const signupsRef = collection(db, 'signups');
        const q = query(signupsRef, orderBy('timestamp', 'desc'));
        const querySnapshot = await getDocs(q);

        console.log('📊 Signup Details');
        console.log('═══════════════════════════════════════════════════════════');
        console.log(`Total signups: ${querySnapshot.size}\n`);

        if (querySnapshot.empty) {
            console.log('No signups found yet.\n');
        } else {
            querySnapshot.forEach((doc, index) => {
                const data = doc.data();
                const timestamp = data.timestamp?.toDate();
                const timeStr = timestamp ? timestamp.toLocaleString() : 'Unknown time';

                console.log(`${index + 1}. ${data.name || 'Anonymous'}`);
                console.log(`   Email: ${data.email || 'No email'}`);
                console.log(`   Time: ${timeStr}`);
                console.log(`   ID: ${doc.id}`);
                console.log('');
            });
        }

        console.log('═══════════════════════════════════════════════════════════\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error fetching signups:', error.message);
        console.error('Full error:', error);
        process.exit(1);
    }
}

getSignupDetails();
