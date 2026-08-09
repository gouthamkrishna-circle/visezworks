import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  doc,
  setDoc,
  onSnapshot,
} from "firebase/firestore";

// Firebase Configuration
// Admin can update these credentials from Firebase Console (https://console.firebase.google.com)
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDemoVisezWorksKey123456789",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "visezworks.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "visezworks-cms",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "visezworks-cms.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "109876543210",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:109876543210:web:abc123def456789",
};

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);

/**
 * Cloud Sync Status
 */
let isCloudConnected = false;

export function setCloudStatus(status: boolean) {
  isCloudConnected = status;
}

export function getCloudStatus(): boolean {
  return isCloudConnected;
}

/**
 * Save Projects to Firebase Cloud Realtime Database
 */
export async function saveProjectsToCloud(projects: any[]) {
  try {
    const docRef = doc(db, "cms", "projects_data");
    await setDoc(docRef, { projects, updatedAt: new Date().toISOString() });
    setCloudStatus(true);
    return true;
  } catch (err) {
    console.warn("Firebase sync note (falling back to Local Storage):", err);
    setCloudStatus(false);
    return false;
  }
}

/**
 * Save Categories to Firebase Cloud Realtime Database
 */
export async function saveCategoriesToCloud(categories: string[]) {
  try {
    const docRef = doc(db, "cms", "categories_data");
    await setDoc(docRef, { categories, updatedAt: new Date().toISOString() });
    setCloudStatus(true);
    return true;
  } catch (err) {
    console.warn("Firebase sync note:", err);
    return false;
  }
}

/**
 * Listen for Real-Time Project Updates across all computers and browsers worldwide
 */
export function subscribeToCloudProjects(callback: (projects: any[]) => void) {
  try {
    const docRef = doc(db, "cms", "projects_data");
    return onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists() && snapshot.data()?.projects) {
          setCloudStatus(true);
          callback(snapshot.data().projects);
        }
      },
      (err) => {
        console.warn("Firebase cloud stream note:", err);
        setCloudStatus(false);
      }
    );
  } catch (e) {
    return () => {};
  }
}

/**
 * Listen for Real-Time Category Updates across all computers
 */
export function subscribeToCloudCategories(callback: (categories: string[]) => void) {
  try {
    const docRef = doc(db, "cms", "categories_data");
    return onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists() && snapshot.data()?.categories) {
          callback(snapshot.data().categories);
        }
      },
      (err) => console.warn(err)
    );
  } catch (e) {
    return () => {};
  }
}
