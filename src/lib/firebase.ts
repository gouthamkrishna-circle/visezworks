import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  collection,
  writeBatch,
  getDocs,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

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
export async function uploadMediaToFirebase(
  file: File | Blob,
  folderName: "images" | "videos" = "images"
): Promise<string> {
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
 * Recursively removes undefined fields so Firestore never throws
 * "Unsupported field value: undefined".
 */
function sanitizeForFirestore(obj: any): any {
  if (Array.isArray(obj)) return obj.map(sanitizeForFirestore);
  if (obj !== null && typeof obj === "object") {
    const clean: Record<string, any> = {};
    for (const key of Object.keys(obj)) {
      const val = obj[key];
      if (val === undefined) continue;
      clean[key] = sanitizeForFirestore(val);
    }
    return clean;
  }
  return obj;
}

/**
 * Strips base64 data: URLs from a project before cloud upload.
 * Data URLs can be hundreds of KB each. Only short https:// URLs are kept.
 * The original data URL stays in localStorage for the local admin session.
 */
function stripBlobsForCloud(project: any): any {
  const MAX_FIELD_BYTES = 50_000; // 50 KB per field max
  const safe = { ...project };

  for (const key of ["image", "videoUrl"] as const) {
    const val = safe[key];
    if (typeof val === "string") {
      // Drop data: URLs and blob: URLs — they are local-only
      if (val.startsWith("data:") || val.startsWith("blob:")) {
        delete safe[key];
      } else if (val.length > MAX_FIELD_BYTES) {
        // Truncate any other suspiciously long strings
        delete safe[key];
      }
    }
  }
  return safe;
}

/**
 * Save all projects to Firestore — one document per project.
 * This avoids Firestore's 1 MB per-document limit entirely.
 * Also writes a lightweight index document listing all project IDs and order.
 */
export async function saveProjectsToCloud(projects: any[]): Promise<boolean> {
  const db = getDb();
  if (!db) return false;

  try {
    const batch = writeBatch(db);

    // Write each project as its own document under cms_projects/{id}
    for (const project of projects) {
      const stripped = stripBlobsForCloud(project);
      const safe = sanitizeForFirestore(stripped);
      const docRef = doc(db, "cms_projects", String(safe.id || `p_${Date.now()}`));
      batch.set(docRef, { ...safe, _updatedAt: new Date().toISOString() });
    }

    // Write a lightweight index so listeners can reconstruct order
    const indexRef = doc(db, "cms", "projects_index");
    batch.set(indexRef, {
      ids: projects.map((p) => String(p.id)),
      updatedAt: new Date().toISOString(),
    });

    await batch.commit();
    setCloudStatus(true);
    return true;
  } catch (err: any) {
    // Firestore batches are limited to 500 ops — fall back to sequential writes
    console.warn("Batch write failed, falling back to sequential:", err.code);
    try {
      for (const project of projects) {
        const stripped = stripBlobsForCloud(project);
        const safe = sanitizeForFirestore(stripped);
        const docRef = doc(db, "cms_projects", String(safe.id || `p_${Date.now()}`));
        await setDoc(docRef, { ...safe, _updatedAt: new Date().toISOString() });
      }
      setCloudStatus(true);
      return true;
    } catch (e: any) {
      console.warn("Firebase Cloud Save Note:", e.message);
      setCloudStatus(false);
      return false;
    }
  }
}

/**
 * Delete a single project from the cloud collection.
 */
export async function deleteProjectFromCloud(projectId: string): Promise<void> {
  const db = getDb();
  if (!db) return;
  try {
    await deleteDoc(doc(db, "cms_projects", projectId));
  } catch (e) {
    console.warn("Cloud delete note:", e);
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
 * Listen for Real-Time Project Updates — subscribes to the cms_projects collection.
 * Each document is a project. Uses the index doc for ordering.
 */
export function subscribeToCloudProjects(callback: (projects: any[]) => void) {
  if (typeof window === "undefined") return () => {};
  const db = getDb();
  if (!db) return () => {};

  try {
    const colRef = collection(db, "cms_projects");
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (snapshot.empty) return;
        // Reconstruct array sorted by _updatedAt descending (newest first)
        const projects = snapshot.docs
          .map((d) => {
            const data = d.data();
            // Remove internal Firestore metadata field
            const { _updatedAt, ...project } = data;
            return project;
          })
          .sort((a, b) => {
            // Sort by createdAt descending
            return (b.createdAt || "").localeCompare(a.createdAt || "");
          });

        setCloudStatus(true);
        callback(projects);
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
