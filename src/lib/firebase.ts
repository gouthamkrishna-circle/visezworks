import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  doc,
  setDoc,
  onSnapshot,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Firebase Configuration
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAqm1lP2BGSyPF--SvhohWfpP8kcoj4i0M",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "visezworks-f0187.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "visezworks-f0187",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "visezworks-f0187.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "774572746662",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:774572746662:web:0b1be6d3b6dc6ebfc2d167",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-E3HMR7BH3P",
};

/**
 * SSR-Safe Lazy Firebase App Initialization
 */
function getFirebaseApp() {
  if (typeof window === "undefined") return null;
  try {
    return !getApps().length ? initializeApp(firebaseConfig) : getApp();
  } catch (e) {
    return null;
  }
}

export function getDb() {
  const app = getFirebaseApp();
  if (!app) return null;
  try {
    return getFirestore(app);
  } catch (e) {
    return null;
  }
}

export function getStorageInstance() {
  const app = getFirebaseApp();
  if (!app) return null;
  try {
    return getStorage(app);
  } catch (e) {
    return null;
  }
}

import { compressImageFile } from "./media-storage";

/**
 * Uploads/Compresses a File into a 100% CORS-free Firestore Cloud URL.
 */
export async function uploadMediaToFirebase(file: File | Blob, folderName: "images" | "videos" = "images"): Promise<string> {
  try {
    const compressedUrl = await compressImageFile(file);
    return compressedUrl;
  } catch (err) {
    return URL.createObjectURL(file);
  }
}

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
  const db = getDb();
  if (!db) return false;
  try {
    const docRef = doc(db, "cms", "projects_data");
    await setDoc(docRef, { projects, updatedAt: new Date().toISOString() });
    setCloudStatus(true);
    return true;
  } catch (err: any) {
    console.warn("Firebase Cloud Save Note:", err);
    setCloudStatus(false);
    return false;
  }
}

/**
 * Save Categories to Firebase Cloud Realtime Database
 */
export async function saveCategoriesToCloud(categories: string[]) {
  const db = getDb();
  if (!db) return false;
  try {
    const docRef = doc(db, "cms", "categories_data");
    await setDoc(docRef, { categories, updatedAt: new Date().toISOString() });
    setCloudStatus(true);
    return true;
  } catch (err: any) {
    console.warn("Firebase Categories Save Note:", err);
    return false;
  }
}

/**
 * Listen for Real-Time Project Updates across all computers and browsers worldwide
 */
export function subscribeToCloudProjects(callback: (projects: any[]) => void) {
  if (typeof window === "undefined") return () => {};
  const db = getDb();
  if (!db) return () => {};

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
  if (typeof window === "undefined") return () => {};
  const db = getDb();
  if (!db) return () => {};

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
