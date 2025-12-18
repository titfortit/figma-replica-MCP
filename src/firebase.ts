import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent } from "firebase/analytics";
import { getFirestore, collection, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore";

// Your web app's Firebase configuration
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

// Initialize services
export const analytics = getAnalytics(app);
export const db = getFirestore(app);

// Check if user exists (case-insensitive email check)
export const checkUserExists = async (email: string): Promise<{ exists: boolean; name?: string }> => {
    try {
        const signupsRef = collection(db, "signups");
        const q = query(signupsRef, where("email", "==", email.toLowerCase()));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data();
            return { exists: true, name: userData.name };
        }
        return { exists: false };
    } catch (e) {
        console.error('Error checking user:', e);
        return { exists: false };
    }
};

// Sign up new user (only if doesn't exist)
export const signupUser = async (name: string, email: string): Promise<{ success: boolean; message: string }> => {
    try {
        // Check if user already exists (case-insensitive)
        const userCheck = await checkUserExists(email);
        if (userCheck.exists) {
            return { success: false, message: 'Email already registered. Please sign in instead.' };
        }

        // Create new user
        await addDoc(collection(db, "signups"), {
            name,
            email: email.toLowerCase(), // Store email in lowercase
            timestamp: serverTimestamp()
        });
        console.log('Signup saved to Firestore');
        return { success: true, message: 'Signup successful!' };
    } catch (e) {
        console.error('Error saving signup:', e);
        return { success: false, message: 'Error during signup. Please try again.' };
    }
};

// Sign in existing user
export const signinUser = async (email: string): Promise<{ success: boolean; message: string; name?: string }> => {
    try {
        const userCheck = await checkUserExists(email);
        if (userCheck.exists) {
            return { success: true, message: 'Login successful!', name: userCheck.name };
        }
        return { success: false, message: 'Email not found. Please sign up first.' };
    } catch (e) {
        console.error('Error during signin:', e);
        return { success: false, message: 'Error during signin. Please try again.' };
    }
};

// Helper function to log CTA click
export const logCTAClick = async () => {
    try {
        // 1. Log to Google Analytics
        logEvent(analytics, 'select_content', {
            content_type: 'button',
            item_id: 'big_cta_button'
        });

        // 2. Save to Firestore Database
        await addDoc(collection(db, "cta_clicks"), {
            timestamp: serverTimestamp(),
            userAgent: navigator.userAgent,
            location: window.location.href
        });
        console.log('Click logged to Firestore & Analytics');
    } catch (e) {
        console.error("Error logging click: ", e);
    }
};
