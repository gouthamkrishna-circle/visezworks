import { useState, useEffect } from "react";
import {
  saveProjectsToCloud,
  saveCategoriesToCloud,
  subscribeToCloudProjects,
  subscribeToCloudCategories,
} from "./firebase";

export const PROJECT_CATEGORIES = [
  "Web Development",
  "Video / Editing",
  "Digital Products",
  "Automations",
  "Social Media",
] as const;

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];
export type ProjectVisibility = "Published" | "Hidden";

export type ProjectItem = {
  id: string;
  title: string;
  description: string;
  details?: string;
  category: ProjectCategory;
  image?: string;
  videoUrl?: string;
  aspectRatio?: "9:16" | "16:9" | "1:1" | "4:5" | "Auto";
  link?: string;
  featured?: boolean;
  visibility?: ProjectVisibility;
  createdAt: string;
};

export type InquiryItem = {
  id: string;
  name: string;
  phone?: string;
  email: string;
  service: "Web Development" | "Video Editing" | "Both" | "General Inquiry";
  message: string;
  status: "New" | "Replied" | "Archived";
  date: string;
};

export type SiteSettings = {
  agencyName: string;
  agencyStatus: string;
  contactEmail: string;
  heroSubtitle: string;
  heroDescription: string;
  totalProjectsCompleted: number;
  clientSatisfactionRate: number;
};

export type ActivityLog = {
  id: string;
  action: string;
  details: string;
  timestamp: string;
};

const DEFAULT_PROJECTS: ProjectItem[] = [];


const DEFAULT_INQUIRIES: InquiryItem[] = [
  {
    id: "inq-101",
    name: "Sarah Jenkins",
    email: "sarah@lumina.io",
    service: "Web Development",
    message:
      "Hi VisezWorks team! We need a high-converting web landing page for our SaaS launch next month.",
    status: "New",
    date: "2026-08-08 09:15 AM",
  },
  {
    id: "inq-102",
    name: "Marcus Vance",
    email: "m.vance@creatorlab.com",
    service: "Video Editing",
    message:
      "Looking for a video editing partner for a batch of 15 short-form reels with kinetic text motion.",
    status: "New",
    date: "2026-08-07 04:30 PM",
  },
  {
    id: "inq-103",
    name: "David K.",
    email: "david@apexmedia.co",
    service: "Both",
    message:
      "We need both a brand website redesign and promotional launch film. What is your current timeline?",
    status: "Replied",
    date: "2026-08-05 11:20 AM",
  },
];

const DEFAULT_SETTINGS: SiteSettings = {
  agencyName: "VisezWorks",
  agencyStatus: "Taking new client projects for Q3/Q4",
  contactEmail: "visezworks@gmail.com",
  heroSubtitle: "Web development & video editing for brands, creators, and businesses.",
  heroDescription:
    "VisezWorks creates fast, modern websites and engaging video content designed to make brands stand out.",
  totalProjectsCompleted: 34,
  clientSatisfactionRate: 99,
};

const DEFAULT_LOGS: ActivityLog[] = [
  {
    id: "log-1",
    action: "System Initialization",
    details: "Admin panel initialized successfully.",
    timestamp: "10:00 AM",
  },
];

export const DEFAULT_CATEGORIES: string[] = [
  "Web Development",
  "Video / Editing",
  "Digital Products",
  "Automations",
  "Social Media",
];

const STORAGE_KEYS = {
  PROJECTS: "visezworks_admin_projects",
  INQUIRIES: "visezworks_admin_inquiries",
  SETTINGS: "visezworks_admin_settings",
  LOGS: "visezworks_admin_logs",
  CATEGORIES: "visezworks_admin_categories",
  PASSCODE: "visezworks_admin_passcode",
};

export function getStoredCategories(): string[] {
  if (typeof window === "undefined") return DEFAULT_CATEGORIES;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return DEFAULT_CATEGORIES;
}

export function saveCategories(cats: string[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(cats));
  saveCategoriesToCloud(cats);
}

export function normalizeProjectCategory(cat: string): string {
  if (cat === "WEB" || cat === "Web Development") return "Web Development";
  if (cat === "VIDEO" || cat === "Video Editing" || cat === "Video / Editing")
    return "Video / Editing";
  if (cat === "Digital Products") return "Digital Products";
  if (cat === "Automations") return "Automations";
  if (cat === "Social Media") return "Social Media";
  return cat || "Web Development";
}

export function getStoredProjects(): ProjectItem[] {
  if (typeof window === "undefined") return DEFAULT_PROJECTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    if (raw) {
      const parsed: Record<string, unknown>[] = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((p) => ({
          id: String(p.id || "p-" + Math.random()),
          title: String(p.title || "Untitled"),
          description: String(p.description || ""),
          details: p.details ? String(p.details) : undefined,
          category: normalizeProjectCategory(String(p.category || "")) as any,
          image: p.image ? String(p.image) : undefined,
          videoUrl: p.videoUrl ? String(p.videoUrl) : undefined,
          aspectRatio: p.aspectRatio ? (p.aspectRatio as any) : undefined,
          link: p.link ? String(p.link) : undefined,
          featured: p.featured !== false,
          visibility: (p.visibility as ProjectVisibility) || "Published",
          createdAt: String(p.createdAt || "2026-08-01"),
        }));
      }
    }
  } catch {}
  return DEFAULT_PROJECTS;
}

export function saveProjects(projects: ProjectItem[]) {
  if (typeof window === "undefined") return;

  // 1. Send to Firebase Cloud Database FIRST
  saveProjectsToCloud(projects);

  // 2. Save to localStorage safely without throwing QuotaExceededError
  try {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  } catch (err) {
    console.warn("localStorage quota exceeded; stripping heavy media for local storage cache:", err);
    try {
      const sanitized = projects.map((p) => {
        if (p.videoUrl && p.videoUrl.startsWith("data:")) {
          const { videoUrl, ...rest } = p;
          return rest;
        }
        return p;
      });
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(sanitized));
    } catch (e) {
      console.warn("Relying on Firebase Cloud Database for project storage.", e);
    }
  }
}

export function getStoredInquiries(): InquiryItem[] {
  if (typeof window === "undefined") return DEFAULT_INQUIRIES;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.INQUIRIES);
    if (raw) return JSON.parse(raw);
  } catch {}
  return DEFAULT_INQUIRIES;
}

export function saveInquiries(inquiries: InquiryItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(inquiries));
}

export function getStoredSettings(): SiteSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (raw) return JSON.parse(raw);
  } catch {}
  return DEFAULT_SETTINGS;
}

export function saveSettings(settings: SiteSettings) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

export function getStoredLogs(): ActivityLog[] {
  if (typeof window === "undefined") return DEFAULT_LOGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LOGS);
    if (raw) return JSON.parse(raw);
  } catch {}
  return DEFAULT_LOGS;
}

export function addLog(action: string, details: string) {
  if (typeof window === "undefined") return DEFAULT_LOGS;
  const currentLogs = getStoredLogs();
  const newLog: ActivityLog = {
    id: "log-" + Date.now(),
    action,
    details,
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  };
  const updated = [newLog, ...currentLogs].slice(0, 50);
  localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(updated));
  return updated;
}

export const EVENT_NAME = "visezworks_admin_store_change";

export function notifyStoreChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(EVENT_NAME));
  }
}

export function useAdminData() {
  const [projects, setProjects] = useState<ProjectItem[]>(DEFAULT_PROJECTS);
  const [inquiries, setInquiries] = useState<InquiryItem[]>(DEFAULT_INQUIRIES);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [logs, setLogs] = useState<ActivityLog[]>(DEFAULT_LOGS);
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);

  const syncAll = () => {
    setProjects(getStoredProjects());
    setInquiries(getStoredInquiries());
    setSettings(getStoredSettings());
    setLogs(getStoredLogs());
    setCategories(getStoredCategories());
  };

  useEffect(() => {
    // Hydrate from localStorage first (only if data exists there from a previous session)
    syncAll();

    // Always subscribe to Firebase Cloud — cloud data always wins
    const unsubCloudProjects = subscribeToCloudProjects((cloudProjects) => {
      if (cloudProjects && cloudProjects.length > 0) {
        localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(cloudProjects));
        setProjects(cloudProjects);
      }
    });

    const unsubCloudCategories = subscribeToCloudCategories((cloudCats) => {
      if (cloudCats && cloudCats.length > 0) {
        localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(cloudCats));
        setCategories(cloudCats);
      }
    });

    const handleSync = () => syncAll();
    window.addEventListener(EVENT_NAME, handleSync);
    window.addEventListener("storage", handleSync);

    return () => {
      unsubCloudProjects();
      unsubCloudCategories();
      window.removeEventListener(EVENT_NAME, handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  const updateProjects = (newProjects: ProjectItem[], actionName?: string) => {
    setProjects(newProjects);
    saveProjects(newProjects);
    if (actionName) {
      addLog(actionName, `Updated projects list (${newProjects.length} total)`);
    }
    notifyStoreChange();
  };

  const updateCategories = (newCategories: string[], actionName?: string) => {
    setCategories(newCategories);
    saveCategories(newCategories);
    if (actionName) {
      addLog(actionName, `Updated categories list (${newCategories.length} total)`);
    }
    notifyStoreChange();
  };

  const deleteCategory = (categoryToDelete: string) => {
    const next = categories.filter((c) => c !== categoryToDelete);
    updateCategories(next, `Deleted Category: ${categoryToDelete}`);
  };

  const addCategory = (categoryToAdd: string) => {
    const trimmed = categoryToAdd.trim();
    if (!trimmed || categories.includes(trimmed)) return;
    const next = [...categories, trimmed];
    updateCategories(next, `Added Category: ${trimmed}`);
  };

  const updateInquiries = (newInquiries: InquiryItem[], actionName?: string) => {
    setInquiries(newInquiries);
    saveInquiries(newInquiries);
    if (actionName) {
      addLog(actionName, `Updated inquiries (${newInquiries.length} total)`);
    }
    notifyStoreChange();
  };

  const updateSiteSettings = (newSettings: SiteSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
    addLog("Site Settings Updated", "Saved changes to agency settings.");
    notifyStoreChange();
  };

  const addInquiry = (inquiry: Omit<InquiryItem, "id" | "date" | "status">) => {
    const currentInquiries = getStoredInquiries();
    const newItem: InquiryItem = {
      ...inquiry,
      id: "inq-" + Date.now(),
      status: "New",
      date: new Date().toLocaleString([], { dateStyle: "short", timeStyle: "short" }),
    };
    const next = [newItem, ...currentInquiries];
    updateInquiries(next, "New Inquiry Received");
    return newItem;
  };

  return {
    projects,
    inquiries,
    settings,
    logs,
    categories,
    updateProjects,
    updateInquiries,
    updateSiteSettings,
    updateCategories,
    addCategory,
    deleteCategory,
    addInquiry,
  };
}
