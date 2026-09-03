import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

// Only auth + firestore are initialized eagerly here, since this module is
// imported on every route (AuthContext needs `auth`, most pages need `db`).
// Storage and Analytics are NOT needed on every route, so they are
// dynamically imported only where actually used — see firebase/storage.js
// and firebase/analytics.js. This keeps their SDK code (and the
// @firebase/storage / @firebase/analytics packages) out of the chunk that
// loads before anything renders.
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;
