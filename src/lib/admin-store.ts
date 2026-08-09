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
  "AI Solutions",
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

const DEFAULT_PROJECTS: ProjectItem[] = [
  {
    id: "p1",
    title: "Northwind Studio",
    description: "Marketing site and booking flow for a boutique production studio.",
    details:
      "Full responsive web development with interactive booking engine, optimized animations, and dark mode aesthetic built for high-tier agency conversions.",
    category: "Web Development",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
    link: "https://northwindstudio.example.com",
    featured: true,
    visibility: "Published",
    createdAt: "2026-08-01",
  },
  {
    id: "p2",
    title: "Lumen Fintech",
    description: "Conversion-focused landing page with interactive product tour.",
    details:
      "High-performance web architecture featuring dynamic live charts, custom web micro-interactions, and lead capture pipelines.",
    category: "Web Development",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
    link: "https://lumenfintech.example.com",
    featured: true,
    visibility: "Published",
    createdAt: "2026-08-03",
  },
  {
    id: "p3",
    title: "Kinetic Launch Film",
    description: "60-second promotional edit with motion typography and sound design.",
    details:
      "Cinematic promotional video editing engineered for high audience retention, fast-paced transitions, and rhythm-synced typography.",
    category: "Video / Editing",
    image:
      "https://images.unsplash.com/photo-1536240478700-b869070f9279?q=80&w=1200&auto=format&fit=crop",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    link: "https://youtube.com/watch?v=example1",
    featured: true,
    visibility: "Published",
    createdAt: "2026-08-05",
  },
  {
    id: "p4",
    title: "Creator Shorts Pack",
    description: "Short-form social edits built for retention and viral pacing.",
    details:
      "Series of high-impact vertical edits formatted for TikTok, Instagram Reels, and YouTube Shorts with dynamic caption animations.",
    category: "Video / Editing",
    image:
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=1200&auto=format&fit=crop",
    link: "https://instagram.com/p/example2",
    featured: true,
    visibility: "Published",
    createdAt: "2026-08-06",
  },
  {
    id: "p5",
    title: "Nova UI Design System",
    description: "Modular React UI kit and accessible token system for modern web apps.",
    details:
      "Comprehensive digital product UI framework complete with 40+ responsive components, Figma design variables, and accessible WCAG color scales.",
    category: "Digital Products",
    image:
      "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=1200&auto=format&fit=crop",
    link: "https://nova-ui.example.com",
    featured: true,
    visibility: "Published",
    createdAt: "2026-08-04",
  },
  {
    id: "p6",
    title: "Pulse SaaS Dashboard Kit",
    description: "Analytics dashboard starter template with prebuilt charts & auth.",
    details:
      "Ready-to-deploy digital product template tailored for SaaS founders, featuring real-time data visualizers and responsive layout presets.",
    category: "Digital Products",
    image:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1200&auto=format&fit=crop",
    link: "https://pulse-saas.example.com",
    featured: false,
    visibility: "Published",
    createdAt: "2026-08-02",
  },
  {
    id: "p7",
    title: "ZapFlow Lead Sync Pipeline",
    description: "Automated CRM lead router connecting Typeform, Slack, and HubSpot.",
    details:
      "Custom automated workflow system that eliminates manual data entry by routing incoming leads instantly to sales channels.",
    category: "Automations",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop",
    link: "https://zapflow.example.com",
    featured: true,
    visibility: "Published",
    createdAt: "2026-08-05",
  },
  {
    id: "p8",
    title: "AutoDoc Invoice Engine",
    description: "Scheduled backend process for generating and emailing PDF invoices.",
    details:
      "Serverless automation process executing nightly billings, client notifications, and automated accounting sync.",
    category: "Automations",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop",
    link: "https://autodoc.example.com",
    featured: false,
    visibility: "Published",
    createdAt: "2026-08-03",
  },
  {
    id: "p9",
    title: "Synthetix AI Content Assistant",
    description: "LLM-driven copywriting agent for auto-generating blog posts & copy.",
    details:
      "Custom AI solution built on Gemini API with prompt template libraries, tone controls, and instant SEO scoring.",
    category: "AI Solutions",
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
    link: "https://synthetix.example.com",
    featured: true,
    visibility: "Published",
    createdAt: "2026-08-07",
  },
  {
    id: "p10",
    title: "Cognitive Support Bot",
    description: "Smart customer service AI trained on client knowledgebases.",
    details:
      "Embeddable intelligent support agent capable of resolving customer inquiries 24/7 with context-aware responses.",
    category: "AI Solutions",
    image:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1200&auto=format&fit=crop",
    link: "https://cognitive-bot.example.com",
    featured: false,
    visibility: "Published",
    createdAt: "2026-08-06",
  },
  {
    id: "p11",
    title: "Apex Viral Motion Reel Pack",
    description: "Social media campaign kit with motion graphics and audio sync.",
    details:
      "30-day social media content bundle tailored for brand growth, high engagement rates, and platform algorithmic reach.",
    category: "Social Media",
    image:
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1200&auto=format&fit=crop",
    link: "https://apex-reels.example.com",
    featured: true,
    visibility: "Published",
    createdAt: "2026-08-06",
  },
  {
    id: "p12",
    title: "Aura Brand Instagram Kit",
    description: "Cohesive aesthetic template suite for lifestyle and fashion brands.",
    details:
      "Turnkey social asset library including carousel templates, story highlights, and brand guidelines.",
    category: "Social Media",
    image:
      "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?q=80&w=1200&auto=format&fit=crop",
    link: "https://aura-social.example.com",
    featured: false,
    visibility: "Published",
    createdAt: "2026-08-04",
  },
];

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
  "AI Solutions",
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
  if (cat === "AI Solutions") return "AI Solutions";
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
    // Save defaults to local storage if empty
    if (!localStorage.getItem(STORAGE_KEYS.PROJECTS)) saveProjects(DEFAULT_PROJECTS);
    if (!localStorage.getItem(STORAGE_KEYS.INQUIRIES)) saveInquiries(DEFAULT_INQUIRIES);
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) saveSettings(DEFAULT_SETTINGS);
    if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) saveCategories(DEFAULT_CATEGORIES);

    // Hydrate state from localStorage after client mount
    syncAll();

    // Subscribe to Firebase Cloud Realtime Database (Multi-Admin Multi-Computer Real-Time Sync)
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
