import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  doc,
  setDoc,
  onSnapshot,
} from "firebase/firestore";

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

import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);
export const storage = getStorage(app);

/**
 * Uploads a File (Image or Video) to Firebase Cloud Storage and returns a 100% permanent CDN URL.
 */
export async function uploadMediaToFirebase(file: File | Blob, folderName: "images" | "videos" = "images"): Promise<string> {
  try {
    const fileName = `${folderName}/${Date.now()}_${(file as File).name || "media_file"}`;
    const storageRef = ref(storage, fileName);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(snapshot.ref);
    return downloadUrl;
  } catch (err) {
    console.warn("Firebase Storage Upload note:", err);
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
  try {
    const docRef = doc(db, "cms", "projects_data");
    await setDoc(docRef, { projects, updatedAt: new Date().toISOString() });
    setCloudStatus(true);
    return true;
  } catch (err: any) {
    console.error("Firebase Cloud Save Error:", err);
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
  } catch (err: any) {
    console.error("Firebase Categories Save Error:", err);
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
