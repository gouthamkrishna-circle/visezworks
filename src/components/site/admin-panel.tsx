import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard,
  FolderKanban,
  Inbox,
  Settings,
  Activity,
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  Lock,
  Unlock,
  ExternalLink,
  ShieldCheck,
  Search,
  RefreshCw,
  Sparkles,
  ArrowUpRight,
  Eye,
  EyeOff,
  CheckCircle2,
  Clock,
  Archive,
  BarChart3,
  Mail,
  User,
  Calendar,
  Star,
  Upload,
  Video,
  Layers,
  FileText,
  Filter,
  Sun,
  Moon,
} from "lucide-react";
import { VisezWorksResponsiveLogo } from "./logo";
import { Roadmap } from "./roadmap";
import { saveVideoFile, compressImageFile } from "@/lib/media-storage";
import { uploadMediaToFirebase } from "@/lib/firebase";
import {
  useAdminData,
  ProjectItem,
  InquiryItem,
  SiteSettings,
  PROJECT_CATEGORIES,
  ProjectCategory,
  ProjectVisibility,
} from "@/lib/admin-store";

const ADMIN_PASSCODE = "admin123";

export function AdminPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [passcodeError, setPasscodeError] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "projects" | "roadmap" | "inquiries" | "settings" | "logs"
  >("dashboard");

  const {
    projects,
    inquiries,
    settings,
    logs,
    categories,
    updateProjects,
    updateInquiries,
    updateSiteSettings,
    addCategory,
    deleteCategory,
  } = useAdminData();

  const [isDark, setIsDark] = useState(() =>
    typeof document !== "undefined" ? document.documentElement.classList.contains("dark") : false,
  );

  const toggleAdminTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", nextDark);
    }
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [inquiryFilter, setInquiryFilter] = useState<"All" | "New" | "Replied" | "Archived">("All");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("All");
  const [newCategoryInput, setNewCategoryInput] = useState("");
  const [showCategoryManager, setShowCategoryManager] = useState(false);

  // Project edit/add modal state
  const [editingProject, setEditingProject] = useState<Partial<ProjectItem> | null>(null);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [selectedDropdownProjectId, setSelectedDropdownProjectId] = useState<string>("");

  // Settings form local state
  const [settingsForm, setSettingsForm] = useState<SiteSettings>(settings);
  const [savedSuccessNotice, setSavedSuccessNotice] = useState("");

  // Sync settings form when settings change
  useEffect(() => {
    setSettingsForm(settings);
  }, [settings]);

  // Listen for hash change (#admin or #roadmap) and global keyboard shortcuts (Ctrl+Shift+A, Cmd+Shift+A, Alt+A)
  useEffect(() => {
    const checkHash = () => {
      const hash = window.location.hash;
      if (
        hash === "#admin" ||
        hash.includes("admin") ||
        hash === "#roadmap" ||
        hash.includes("roadmap")
      ) {
        setIsOpen(true);
        if (hash === "#roadmap" || hash.includes("roadmap")) {
          setActiveTab("roadmap");
        }
      } else {
        setIsOpen(false);
      }
    };

    checkHash();
    window.addEventListener("hashchange", checkHash);

    const handleKeyDown = (e: KeyboardEvent) => {
      // Shortcut: Ctrl + Shift + A  OR  Cmd + Shift + A  OR  Alt + A
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;
      const isKeyA = e.key.toLowerCase() === "a";
      const isKeyEscape = e.key === "Escape";

      if ((isCmdOrCtrl && e.shiftKey && isKeyA) || (e.altKey && isKeyA)) {
        e.preventDefault();
        if (isOpen) {
          closeAdmin();
        } else {
          window.location.hash = "#admin";
          setIsOpen(true);
        }
      } else if (isKeyEscape && isOpen) {
        closeAdmin();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("hashchange", checkHash);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const closeAdmin = () => {
    setIsOpen(false);
    // remove #admin from location hash cleanly
    if (window.location.hash === "#admin" || window.location.hash.includes("admin")) {
      history.pushState("", document.title, window.location.pathname + window.location.search);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim() === ADMIN_PASSCODE || passcode.trim() === "admin") {
      setIsAuthenticated(true);
      setPasscodeError(false);
      setPasscode("");
    } else {
      setPasscodeError(true);
    }
  };

  // Quick project actions
  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject?.title?.trim()) {
      alert("Please enter a Project Title before saving!");
      return;
    }

    const category = editingProject.category || categories[0] || "Web Development";
    const projToSave = { ...editingProject, category };

    if (isAddingProject) {
      const newProj: ProjectItem = {
        id: "p-" + Date.now(),
        title: projToSave.title?.trim() || "Untitled Project",
        description: projToSave.description || "",
        details: projToSave.details || "",
        category: projToSave.category as any,
        image: projToSave.image || "",
        videoUrl: projToSave.videoUrl || "",
        link: projToSave.link || "#",
        featured: projToSave.featured ?? true,
        visibility: projToSave.visibility || "Published",
        createdAt: new Date().toISOString().split("T")[0]!,
      };
      updateProjects([newProj, ...projects], `Created Project: ${newProj.title}`);
    } else if (editingProject.id) {
      const updated = projects.map((p) =>
        p.id === editingProject.id ? ({ ...p, ...projToSave } as ProjectItem) : p,
      );
      updateProjects(updated, `Updated Project: ${projToSave.title}`);
    }

    const title = projToSave.title || "Project";
    setSavedSuccessNotice(`Project "${title}" saved! Changes updated across website live.`);
    setTimeout(() => setSavedSuccessNotice(""), 5000);

    setEditingProject(null);
    setIsAddingProject(false);
  };

  const handleToggleVisibility = (id: string) => {
    const proj = projects.find((p) => p.id === id);
    if (!proj) return;
    const newVis: ProjectVisibility = proj.visibility === "Hidden" ? "Published" : "Hidden";
    const updated = projects.map((p) => (p.id === id ? { ...p, visibility: newVis } : p));
    updateProjects(updated, `Toggled Visibility for ${proj.title} to ${newVis}`);
  };

  const handleToggleFeatured = (id: string) => {
    const proj = projects.find((p) => p.id === id);
    if (!proj) return;
    const updated = projects.map((p) => (p.id === id ? { ...p, featured: !p.featured } : p));
    updateProjects(updated, `Toggled Featured status for ${proj.title}`);
  };

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Upload to Firebase Cloud Storage for permanent 100% cloud link
      const cloudUrl = await uploadMediaToFirebase(file, "images");
      setEditingProject((prev) => ({ ...prev, image: cloudUrl }));
    }
  };

  const handleVideoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const id = "vid-" + Date.now();
      // Save to IndexedDB (500MB+ storage limit, zero localStorage QuotaExceededError!)
      const { mediaId, objectUrl } = await saveVideoFile(id, file);

      const v = document.createElement("video");
      v.src = objectUrl;
      v.onloadedmetadata = () => {
        const ratio = v.videoWidth / v.videoHeight;
        let detectedAspect: "9:16" | "16:9" | "1:1" | "4:5" = "16:9";
        if (ratio < 0.7) detectedAspect = "9:16";
        else if (ratio < 0.95) detectedAspect = "4:5";
        else if (ratio >= 0.95 && ratio <= 1.1) detectedAspect = "1:1";
        else detectedAspect = "16:9";

        setEditingProject((prev) => ({
          ...prev,
          videoUrl: mediaId,
          aspectRatio: prev?.aspectRatio || detectedAspect,
        }));
      };

      setEditingProject((prev) => ({ ...prev, videoUrl: mediaId }));
    }
  };

  const handleDeleteProject = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      const updated = projects.filter((p) => p.id !== id);
      updateProjects(updated, `Deleted Project: ${title}`);
    }
  };

  const handleInquiryStatus = (id: string, newStatus: "New" | "Replied" | "Archived") => {
    const updated = inquiries.map((inq) => (inq.id === id ? { ...inq, status: newStatus } : inq));
    updateInquiries(updated, `Updated Inquiry status to ${newStatus}`);
  };

  const handleDeleteInquiry = (id: string) => {
    if (confirm("Delete this inquiry submission?")) {
      const updated = inquiries.filter((inq) => inq.id !== id);
      updateInquiries(updated, "Deleted Inquiry submission");
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteSettings(settingsForm);
    setSavedSuccessNotice("Site settings saved successfully!");
    setTimeout(() => setSavedSuccessNotice(""), 3000);
  };

  if (!isOpen) return null;

  const filteredInquiries = inquiries.filter((inq) => {
    const matchesFilter = inquiryFilter === "All" || inq.status === inquiryFilter;
    const matchesSearch =
      inq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const unreadCount = inquiries.filter((i) => i.status === "New").length;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background/95 backdrop-blur-xl text-foreground font-sans overflow-hidden">
      {/* Background Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--grid-line)_1px,transparent_1px),linear-gradient(to_bottom,var(--grid-line)_1px,transparent_1px)] bg-[size:44px_44px] opacity-40 pointer-events-none" />

      {/* Top Console Navigation Bar */}
      <header className="relative z-10 flex h-16 shrink-0 items-center justify-between border-b border-border bg-card/80 px-6 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <VisezWorksResponsiveLogo className="h-10 w-auto" />
          <span className="rounded bg-primary/10 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-primary border border-primary/20">
            ADMIN CONSOLE
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Dark Mode Toggle inside Admin Mode */}
          <button
            onClick={toggleAdminTheme}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-secondary px-3 py-1.5 font-mono text-[11px] font-medium text-foreground hover:bg-muted transition-colors"
            title="Toggle Dark Mode in Admin Console"
          >
            {isDark ? (
              <>
                <Sun className="size-3.5 text-amber-400" />
                <span>Light</span>
              </>
            ) : (
              <>
                <Moon className="size-3.5 text-foreground" />
                <span>Dark</span>
              </>
            )}
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-emerald-600 dark:text-emerald-400 font-mono text-[11px]">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              AUTHENTICATED
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-amber-600 dark:text-amber-400 font-mono text-[11px]">
              <Lock className="size-3" />
              LOCKED SESSION
            </div>
          )}

          {isAuthenticated && (
            <button
              onClick={() => setIsAuthenticated(false)}
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-secondary px-3 py-1.5 font-mono text-[11px] font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              title="Lock Admin Session"
            >
              <Lock className="size-3" />
              Lock
            </button>
          )}

          <button
            onClick={closeAdmin}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3.5 py-1.5 font-mono text-[11px] font-semibold text-primary-foreground hover:opacity-90 transition-opacity shadow-sm"
          >
            <X className="size-3.5" />
            Exit Admin
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      {!isAuthenticated ? (
        /* PASSCODE GATE */
        <div className="relative z-10 flex flex-1 items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card p-8 shadow-2xl glass-panel"
          >
            <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-primary/10 border border-primary/20 text-primary">
              <Lock className="size-8" />
            </div>

            <div className="mt-6 text-center">
              <p className="eyebrow">RESTRICTED ACCESS</p>
              <h1 className="mt-1 font-display text-2xl uppercase text-foreground">
                Admin Panel Login
              </h1>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Enter your security passcode to access project management, lead inquiries, and site
                configuration.
              </p>
            </div>

            <form onSubmit={handleLogin} className="mt-6 space-y-4">
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">
                  Security Passcode
                </label>
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter admin passcode..."
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                {passcodeError && (
                  <p className="mt-1.5 text-xs text-destructive flex items-center gap-1 font-mono">
                    <X className="size-3" /> Incorrect passcode. Try{" "}
                    <code className="bg-muted px-1 py-0.5 rounded text-primary font-bold">
                      admin123
                    </code>
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-primary py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-primary-foreground hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <Unlock className="size-3.5" />
                Authenticate Session
              </button>
            </form>

            <div className="mt-6 border-t border-border pt-4 text-center">
              <p className="font-mono text-[10px] text-muted-foreground">
                Tip: Default demo passcode is{" "}
                <span className="font-semibold text-primary">admin123</span>
              </p>
            </div>
          </motion.div>
        </div>
      ) : (
        /* AUTHENTICATED ADMIN DASHBOARD */
        <div className="relative z-10 flex flex-1 overflow-hidden">
          {/* Global Saved Changes Toast Notification */}
          <AnimatePresence>
            {savedSuccessNotice && (
              <motion.div
                initial={{ opacity: 0, y: -30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -30, scale: 0.9 }}
                className="fixed top-5 right-8 z-[9999] flex items-center gap-3.5 rounded-2xl border border-emerald-500/50 bg-card/95 p-4 shadow-[0_20px_50px_rgba(16,185,129,0.2)] backdrop-blur-xl"
              >
                <div className="size-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="size-6 text-emerald-500 animate-bounce" />
                </div>
                <div>
                  <p className="font-bebas text-sm uppercase tracking-wider text-emerald-500 font-bold">
                    Changes Saved &amp; Updated Live!
                  </p>
                  <p className="font-sans text-xs text-foreground font-medium">
                    {savedSuccessNotice}
                  </p>
                </div>
                <button
                  onClick={() => setSavedSuccessNotice("")}
                  className="ml-3 rounded-full p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          {/* Sidebar Navigation */}
          <aside className="w-64 shrink-0 border-r border-border bg-card/60 p-4 flex flex-col justify-between">
            <nav className="space-y-1">
              <p className="px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Navigation
              </p>

              <button
                onClick={() => setActiveTab("dashboard")}
                className={`w-full flex items-center justify-between rounded-lg px-3 py-2.5 text-xs font-medium transition-colors ${
                  activeTab === "dashboard"
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <LayoutDashboard className="size-4" />
                  Dashboard
                </span>
                <span className="font-mono text-[10px] opacity-70">01</span>
              </button>

              <button
                onClick={() => setActiveTab("projects")}
                className={`w-full flex items-center justify-between rounded-lg px-3 py-2.5 text-xs font-medium transition-colors ${
                  activeTab === "projects"
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <FolderKanban className="size-4" />
                  Projects
                </span>
                <span className="rounded bg-secondary px-1.5 py-0.5 font-mono text-[10px] text-foreground">
                  {projects.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab("roadmap")}
                className={`w-full flex items-center justify-between rounded-lg px-3 py-2.5 text-xs font-medium transition-colors ${
                  activeTab === "roadmap"
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Sparkles className="size-4" />
                  Studio Roadmap
                </span>
                <span className="font-mono text-[10px] opacity-70">03</span>
              </button>

              <button
                onClick={() => setActiveTab("inquiries")}
                className={`w-full flex items-center justify-between rounded-lg px-3 py-2.5 text-xs font-medium transition-colors ${
                  activeTab === "inquiries"
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Inbox className="size-4" />
                  Inquiries / Leads
                </span>
                {unreadCount > 0 ? (
                  <span className="rounded bg-primary text-primary-foreground px-1.5 py-0.5 font-mono text-[10px] font-bold">
                    {unreadCount} new
                  </span>
                ) : (
                  <span className="rounded bg-secondary px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                    {inquiries.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab("settings")}
                className={`w-full flex items-center justify-between rounded-lg px-3 py-2.5 text-xs font-medium transition-colors ${
                  activeTab === "settings"
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Settings className="size-4" />
                  Site Configuration
                </span>
                <span className="font-mono text-[10px] opacity-70">04</span>
              </button>

              <button
                onClick={() => setActiveTab("logs")}
                className={`w-full flex items-center justify-between rounded-lg px-3 py-2.5 text-xs font-medium transition-colors ${
                  activeTab === "logs"
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Activity className="size-4" />
                  Activity Logs
                </span>
                <span className="rounded bg-secondary px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                  {logs.length}
                </span>
              </button>
            </nav>

            <div className="border-t border-border pt-4 px-2 space-y-2">
              <div className="rounded-lg border border-border bg-background p-3 text-[11px]">
                <p className="font-mono text-[10px] uppercase text-muted-foreground">
                  Agency Status
                </p>
                <p className="mt-1 font-semibold text-foreground truncate">
                  {settings.agencyStatus}
                </p>
              </div>

              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-1.5 w-full rounded-md border border-border py-2 font-mono text-[11px] text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                <Eye className="size-3.5" /> View Public Site <ArrowUpRight className="size-3" />
              </a>
            </div>
          </aside>

          {/* Tab View Content */}
          <main className="flex-1 overflow-y-auto p-8 relative">
            {/* TAB 1: DASHBOARD */}
            {activeTab === "dashboard" && (
              <div className="space-y-8 max-w-6xl mx-auto">
                <div>
                  <p className="eyebrow">Studio Overview</p>
                  <h1 className="font-bebas text-3xl sm:text-4xl uppercase tracking-wider text-foreground">
                    Control Center
                  </h1>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span className="font-mono text-[10px] uppercase tracking-wider">
                        Total Projects
                      </span>
                      <FolderKanban className="size-4 text-primary" />
                    </div>
                    <p className="mt-3 font-display text-3xl font-extrabold text-foreground">
                      {projects.length}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {projects.filter((p) => p.category === "WEB").length} Web •{" "}
                      {projects.filter((p) => p.category === "VIDEO").length} Video
                    </p>
                  </div>

                  <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span className="font-mono text-[10px] uppercase tracking-wider">
                        Inquiries Received
                      </span>
                      <Inbox className="size-4 text-primary" />
                    </div>
                    <p className="mt-3 font-display text-3xl font-extrabold text-foreground">
                      {inquiries.length}
                    </p>
                    <p className="mt-1 text-xs text-primary font-medium flex items-center gap-1">
                      <Sparkles className="size-3" /> {unreadCount} awaiting response
                    </p>
                  </div>

                  <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span className="font-mono text-[10px] uppercase tracking-wider">
                        Client Satisfaction
                      </span>
                      <BarChart3 className="size-4 text-primary" />
                    </div>
                    <p className="mt-3 font-display text-3xl font-extrabold text-foreground">
                      {settings.clientSatisfactionRate}%
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">Based on client feedback</p>
                  </div>

                  <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span className="font-mono text-[10px] uppercase tracking-wider">
                        Completed Work
                      </span>
                      <CheckCircle2 className="size-4 text-emerald-500" />
                    </div>
                    <p className="mt-3 font-display text-3xl font-extrabold text-foreground">
                      {settings.totalProjectsCompleted}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">Historical studio tally</p>
                  </div>
                </div>

                {/* Quick Actions & Recent Inquiries split */}
                <div className="grid gap-6 lg:grid-cols-2">
                  {/* Quick Actions */}
                  <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                    <h2 className="font-bebas text-xl sm:text-2xl uppercase tracking-wider text-foreground mb-4">
                      Quick Studio Actions
                    </h2>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <button
                        onClick={() => {
                          setIsAddingProject(true);
                          setEditingProject({
                            title: "",
                            description: "",
                            category: "WEB",
                            link: "",
                            image: "",
                          });
                          setActiveTab("projects");
                        }}
                        className="flex items-center gap-3 rounded-lg border border-border bg-secondary p-4 text-left hover:border-primary transition-colors group"
                      >
                        <div className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          <Plus className="size-5" />
                        </div>
                        <div>
                          <p className="font-display text-xs uppercase text-foreground">
                            Add New Project
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            Publish to Web or Video portfolio
                          </p>
                        </div>
                      </button>

                      <button
                        onClick={() => setActiveTab("inquiries")}
                        className="flex items-center gap-3 rounded-lg border border-border bg-secondary p-4 text-left hover:border-primary transition-colors group"
                      >
                        <div className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          <Mail className="size-5" />
                        </div>
                        <div>
                          <p className="font-display text-xs uppercase text-foreground">
                            Review Inquiries
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            {unreadCount} new messages
                          </p>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="font-display text-lg uppercase text-foreground">
                        Recent Studio Activity
                      </h2>
                      <button
                        onClick={() => setActiveTab("logs")}
                        className="font-mono text-[10px] uppercase text-primary hover:underline"
                      >
                        View All Logs
                      </button>
                    </div>
                    <div className="space-y-3">
                      {logs.slice(0, 4).map((log) => (
                        <div
                          key={log.id}
                          className="flex items-start justify-between gap-3 border-b border-border/50 pb-2 text-xs"
                        >
                          <div>
                            <p className="font-semibold text-foreground">{log.action}</p>
                            <p className="text-[11px] text-muted-foreground">{log.details}</p>
                          </div>
                          <span className="font-mono text-[10px] text-muted-foreground shrink-0">
                            {log.timestamp}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: PROJECTS MANAGEMENT */}
            {activeTab === "projects" && (
              <div className="space-y-6 max-w-6xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="eyebrow">Portfolio Management</p>
                    <h1 className="font-bebas text-3xl sm:text-4xl uppercase tracking-wider text-foreground">
                      Project CMS &amp; Visibility
                    </h1>
                  </div>

                  <button
                    onClick={() => {
                      setIsAddingProject(true);
                      setEditingProject({
                        title: "",
                        description: "",
                        details: "",
                        category: "Web Development",
                        link: "",
                        image: "",
                        videoUrl: "",
                        visibility: "Published",
                        featured: true,
                      });
                    }}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-xs font-semibold uppercase text-primary-foreground hover:opacity-90 transition-opacity shadow-sm"
                  >
                    <Plus className="size-4" /> Add New Project
                  </button>
                </div>

                {/* Category Overview Stats & Interactive Selector */}
                <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
                  {categories.map((cat) => {
                    const total = projects.filter((p) => p.category === cat).length;
                    const published = projects.filter(
                      (p) => p.category === cat && p.visibility !== "Hidden",
                    ).length;
                    const hidden = total - published;
                    const isSelected = selectedCategoryFilter === cat;

                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedCategoryFilter(isSelected ? "All" : cat)}
                        className={`rounded-xl border p-3 flex flex-col justify-between text-left transition-all cursor-pointer ${
                          isSelected
                            ? "border-primary bg-primary/10 shadow-md ring-1 ring-primary/40"
                            : "border-border bg-card hover:border-primary/50"
                        }`}
                        title={`Click to filter by ${cat}`}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <p className="font-bebas text-xs font-bold uppercase tracking-wider text-muted-foreground truncate">
                            {cat}
                          </p>
                          {isSelected && <Check className="size-3 text-primary shrink-0" />}
                        </div>
                        <div className="mt-2 flex items-baseline justify-between">
                          <span className="font-bebas text-2xl font-bold text-foreground">
                            {total}
                          </span>
                          <span className="font-mono text-[10px] text-muted-foreground">
                            {published} pub / {hidden} hid
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Search, Category Dropdown & Project Select Bar */}
                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 rounded-xl border border-border bg-card p-3 shadow-xs">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 flex-wrap">
                    {/* Search Input */}
                    <div className="relative flex-1 min-w-[200px] max-w-xs">
                      <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search title or details..."
                        className="w-full rounded-lg border border-input bg-background pl-9 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-primary focus:outline-none"
                      />
                    </div>

                    {/* Category Filter Dropdown */}
                    <div className="flex items-center gap-2">
                      <label
                        htmlFor="category-select-dropdown"
                        className="font-bebas text-xs uppercase tracking-wider text-muted-foreground whitespace-nowrap flex items-center gap-1.5"
                      >
                        <Layers className="size-3.5 text-primary" /> Filter Category:
                      </label>
                      <select
                        id="category-select-dropdown"
                        value={selectedCategoryFilter}
                        onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                        className="rounded-lg border border-input bg-background px-3 py-1.5 font-sans text-xs font-semibold text-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors cursor-pointer"
                      >
                        <option value="All">All Categories ({projects.length})</option>
                        {categories.map((cat) => {
                          const count = projects.filter((p) => p.category === cat).length;
                          return (
                            <option key={cat} value={cat}>
                              {cat} ({count})
                            </option>
                          );
                        })}
                      </select>
                      <button
                        onClick={() => setShowCategoryManager(!showCategoryManager)}
                        className="rounded-lg border border-border bg-secondary px-2.5 py-1.5 font-bebas text-xs uppercase text-foreground hover:bg-muted transition-colors tracking-wider"
                        title="Add or Delete Categories"
                      >
                        Manage Categories
                      </button>
                    </div>

                    {/* Quick Select & View Project Dropdown */}
                    <div className="flex items-center gap-2">
                      <label
                        htmlFor="project-select-dropdown"
                        className="font-bebas text-xs uppercase tracking-wider text-muted-foreground whitespace-nowrap flex items-center gap-1.5"
                      >
                        <FolderKanban className="size-3.5 text-primary" /> Select Project:
                      </label>
                      <select
                        id="project-select-dropdown"
                        value={selectedDropdownProjectId}
                        onChange={(e) => setSelectedDropdownProjectId(e.target.value)}
                        className="rounded-lg border border-input bg-background px-3 py-1.5 font-sans text-xs font-semibold text-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors cursor-pointer max-w-[260px] truncate"
                      >
                        <option value="">-- Dropdown: Select &amp; View Project --</option>
                        {projects
                          .filter(
                            (p) =>
                              selectedCategoryFilter === "All" ||
                              p.category === selectedCategoryFilter,
                          )
                          .map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.title} ({p.category}) {p.visibility === "Hidden" ? "[Hidden]" : ""}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>

                  <div className="font-mono text-xs text-muted-foreground flex items-center gap-2 self-end md:self-auto shrink-0">
                    {selectedCategoryFilter !== "All" && (
                      <button
                        onClick={() => setSelectedCategoryFilter("All")}
                        className="text-[10px] uppercase font-bold text-primary hover:underline mr-1"
                      >
                        Clear Category Filter
                      </button>
                    )}
                    <span>
                      Total: <strong className="text-foreground">{projects.length}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Published:{" "}
                      <strong className="text-emerald-500">
                        {projects.filter((p) => p.visibility !== "Hidden").length}
                      </strong>
                    </span>
                    <span>•</span>
                    <span>
                      Hidden:{" "}
                      <strong className="text-amber-500">
                        {projects.filter((p) => p.visibility === "Hidden").length}
                      </strong>
                    </span>
                  </div>
                </div>

                {/* Category Management & Removal Panel */}
                {showCategoryManager && (
                  <div className="rounded-xl border border-primary/40 bg-card p-4 shadow-md space-y-3 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bebas text-sm uppercase tracking-wider text-foreground flex items-center gap-1.5">
                        <Layers className="size-4 text-primary" /> Category Management (Add &amp; Remove Categories)
                      </h4>
                      <button
                        onClick={() => setShowCategoryManager(false)}
                        className="text-xs text-muted-foreground hover:text-foreground"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Click the red (X) button on any category pill to remove it from project filters:
                    </p>

                    <div className="flex flex-wrap items-center gap-2">
                      {categories.map((cat) => (
                        <div
                          key={cat}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary/80 px-3 py-1 font-sans text-xs font-semibold text-foreground shadow-2xs"
                        >
                          <span>{cat}</span>
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to remove category "${cat}"?`)) {
                                deleteCategory(cat);
                              }
                            }}
                            className="text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 rounded p-0.5"
                            title={`Remove category "${cat}"`}
                          >
                            <X className="size-3" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-border/60">
                      <input
                        type="text"
                        value={newCategoryInput}
                        onChange={(e) => setNewCategoryInput(e.target.value)}
                        placeholder="Add new category name..."
                        className="rounded-lg border border-input bg-background px-3 py-1.5 text-xs text-foreground font-sans focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                      <button
                        onClick={() => {
                          if (newCategoryInput.trim()) {
                            addCategory(newCategoryInput.trim());
                            setNewCategoryInput("");
                          }
                        }}
                        className="rounded-lg bg-primary px-3 py-1.5 font-bebas text-xs uppercase text-primary-foreground hover:opacity-90 tracking-wider shadow-xs"
                      >
                        + Add Category
                      </button>
                    </div>
                  </div>
                )}

                {/* Selected Project Quick Inspector & Viewer Card */}
                {selectedDropdownProjectId &&
                  (() => {
                    const selProj = projects.find((p) => p.id === selectedDropdownProjectId);
                    if (!selProj) return null;
                    const isHidden = selProj.visibility === "Hidden";

                    return (
                      <div className="rounded-xl border border-primary/50 bg-card p-5 shadow-xl space-y-4 animate-in fade-in duration-200">
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
                          <div className="flex items-center gap-2">
                            <span className="rounded-md bg-primary/10 border border-primary/20 px-2.5 py-1 font-bebas text-xs text-primary uppercase tracking-wider">
                              Project Selected from Dropdown
                            </span>
                            <span className="font-mono text-xs text-muted-foreground">
                              ID: {selProj.id}
                            </span>
                          </div>
                          <button
                            onClick={() => setSelectedDropdownProjectId("")}
                            className="rounded-lg p-1 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                            title="Close project inspector"
                          >
                            <X className="size-4" />
                          </button>
                        </div>

                        <div className="grid gap-6 md:grid-cols-3">
                          <div className="relative overflow-hidden rounded-lg border border-border bg-secondary aspect-video md:aspect-square">
                            {selProj.image ? (
                              <img
                                src={selProj.image}
                                alt={selProj.title}
                                className="size-full object-cover"
                              />
                            ) : (
                              <div className="flex size-full items-center justify-center font-mono text-xs text-muted-foreground">
                                No Image Preview
                              </div>
                            )}
                          </div>

                          <div className="md:col-span-2 space-y-3 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center gap-2 flex-wrap mb-1.5">
                                <span className="rounded bg-secondary border border-border px-2.5 py-0.5 font-bebas text-xs uppercase tracking-wider text-foreground">
                                  {selProj.category}
                                </span>
                                {isHidden ? (
                                  <span className="rounded bg-amber-500/20 text-amber-500 border border-amber-500/30 px-2 py-0.5 font-mono text-[10px] font-bold uppercase flex items-center gap-1">
                                    <EyeOff className="size-3" /> Hidden
                                  </span>
                                ) : (
                                  <span className="rounded bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 px-2 py-0.5 font-mono text-[10px] font-bold uppercase flex items-center gap-1">
                                    <Eye className="size-3" /> Published
                                  </span>
                                )}
                                {selProj.featured && (
                                  <span className="rounded bg-amber-400/20 text-amber-500 border border-amber-400/30 px-2 py-0.5 font-mono text-[10px] font-bold flex items-center gap-1">
                                    <Star className="size-3 fill-amber-400" /> Featured
                                  </span>
                                )}
                              </div>

                              <h2 className="font-bebas text-2xl sm:text-3xl uppercase tracking-wider text-foreground">
                                {selProj.title}
                              </h2>

                              <p className="mt-2 text-xs sm:text-sm text-foreground/90 font-sans leading-relaxed">
                                {selProj.description}
                              </p>

                              {selProj.details && (
                                <p className="mt-2 text-xs text-muted-foreground font-sans line-clamp-3 bg-secondary/50 p-3 rounded-lg border border-border/50">
                                  {selProj.details}
                                </p>
                              )}

                              {selProj.technologies && selProj.technologies.length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-1.5">
                                  {selProj.technologies.map((tech) => (
                                    <span
                                      key={tech}
                                      className="rounded bg-primary/10 text-primary font-mono text-[10px] px-2 py-0.5 font-semibold"
                                    >
                                      {tech}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>

                            <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-border">
                              <button
                                onClick={() => {
                                  setEditingProject(selProj);
                                  setIsAddingProject(false);
                                }}
                                className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3.5 py-1.5 font-mono text-xs font-semibold text-primary-foreground hover:opacity-90 shadow-xs"
                              >
                                <Sparkles className="size-3.5" /> Edit Details
                              </button>

                              <button
                                onClick={() => handleToggleVisibility(selProj.id)}
                                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-secondary px-3 py-1.5 font-mono text-xs text-foreground hover:bg-muted"
                              >
                                {isHidden ? (
                                  <Eye className="size-3.5 text-emerald-500" />
                                ) : (
                                  <EyeOff className="size-3.5 text-amber-500" />
                                )}
                                {isHidden ? "Publish Project" : "Hide Project"}
                              </button>

                              <button
                                onClick={() => handleToggleFeatured(selProj.id)}
                                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-secondary px-3 py-1.5 font-mono text-xs text-foreground hover:bg-muted"
                              >
                                <Star
                                  className={`size-3.5 ${selProj.featured ? "text-amber-400 fill-amber-400" : ""}`}
                                />
                                {selProj.featured ? "Unfeature" : "Feature"}
                              </button>

                              {selProj.link && (
                                <a
                                  href={selProj.link}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 font-mono text-xs text-muted-foreground hover:text-foreground hover:bg-secondary"
                                >
                                  <ExternalLink className="size-3.5" /> Open Link
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                {/* Edit / Add Modal Overlay */}
                {(isAddingProject || editingProject) && (
                  <div className="rounded-xl border border-primary/40 bg-card p-6 shadow-2xl space-y-4">
                    <div className="flex items-center justify-between border-b border-border pb-3">
                      <h3 className="font-bebas text-xl sm:text-2xl uppercase tracking-wider text-foreground flex items-center gap-2">
                        <Sparkles className="size-4 text-primary" />
                        {isAddingProject ? "Create New Project" : "Edit Project Details"}
                      </h3>
                      <button
                        onClick={() => {
                          setEditingProject(null);
                          setIsAddingProject(false);
                        }}
                        className="text-muted-foreground hover:text-foreground p-1 rounded hover:bg-secondary"
                      >
                        <X className="size-5" />
                      </button>
                    </div>

                    <form onSubmit={handleSaveProject} className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block font-bebas text-xs uppercase tracking-wider text-foreground mb-1">
                          Project Title <span className="text-primary">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={editingProject?.title || ""}
                          onChange={(e) =>
                            setEditingProject({ ...editingProject, title: e.target.value })
                          }
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
                          placeholder="e.g. Northwind Studio Web App"
                        />
                      </div>

                      <div>
                        <label className="block font-bebas text-xs uppercase tracking-wider text-foreground mb-1">
                          Required Category <span className="text-primary">*</span>
                        </label>
                        <select
                          required
                          value={editingProject?.category || "Web Development"}
                          onChange={(e) =>
                            setEditingProject({
                              ...editingProject,
                              category: e.target.value as ProjectCategory,
                            })
                          }
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono text-foreground"
                        >
                          {categories.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block font-mono text-[10px] uppercase text-muted-foreground mb-1">
                          Short Description
                        </label>
                        <textarea
                          rows={2}
                          value={editingProject?.description || ""}
                          onChange={(e) =>
                            setEditingProject({ ...editingProject, description: e.target.value })
                          }
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
                          placeholder="Brief summary shown on portfolio cards..."
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block font-mono text-[10px] uppercase text-muted-foreground mb-1">
                          Detailed Case Study / Scope
                        </label>
                        <textarea
                          rows={3}
                          value={editingProject?.details || ""}
                          onChange={(e) =>
                            setEditingProject({ ...editingProject, details: e.target.value })
                          }
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
                          placeholder="Full case study explanation displayed inside the project detail modal..."
                        />
                      </div>

                      <div>
                        <label className="block font-mono text-[10px] uppercase text-muted-foreground mb-1">
                          Image URL or Upload Asset
                        </label>
                        <input
                          type="text"
                          value={editingProject?.image || ""}
                          onChange={(e) =>
                            setEditingProject({ ...editingProject, image: e.target.value })
                          }
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground mb-2"
                          placeholder="https://images.unsplash.com/..."
                        />
                        <label className="inline-flex items-center gap-1.5 cursor-pointer rounded border border-border bg-secondary px-3 py-1 font-mono text-[11px] text-foreground hover:bg-muted">
                          <Upload className="size-3.5" /> Upload File Asset
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageFileUpload}
                            className="hidden"
                          />
                        </label>
                      </div>

                      {/* Video File Upload & Aspect Ratio Section */}
                      <div className="sm:col-span-2 rounded-xl border border-primary/30 bg-secondary/40 p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <label className="font-bebas text-sm uppercase tracking-wider text-foreground flex items-center gap-1.5">
                            <Video className="size-4 text-primary" /> Video Asset &amp; Permanent Storage
                          </label>
                          {editingProject?.videoUrl && (
                            <button
                              type="button"
                              onClick={() => setEditingProject({ ...editingProject, videoUrl: "" })}
                              className="text-xs text-rose-500 hover:underline font-mono"
                            >
                              Remove Video
                            </button>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className="block font-mono text-[10px] uppercase text-muted-foreground">
                            Video File Path or Cloud URL (100% Permanent Across All Devices)
                          </label>
                          <input
                            type="text"
                            value={editingProject?.videoUrl || ""}
                            onChange={(e) =>
                              setEditingProject({ ...editingProject, videoUrl: e.target.value })
                            }
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs font-mono text-foreground"
                            placeholder="e.g. /videos/my-edit.mp4 or https://cdn.example.com/video.mp4"
                          />
                          <p className="text-[11px] text-muted-foreground font-mono leading-relaxed bg-background/80 p-2 rounded border border-border/60">
                            💡 <span className="text-primary font-bold">Permanent Deployment Tip:</span> Put video files inside <code className="text-primary bg-muted px-1.5 py-0.5 rounded font-bold">public/videos/</code> in your project folder to make them a permanent part of your website!
                          </p>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2 items-center pt-2">
                          <div>
                            <label className="block font-mono text-[10px] uppercase text-muted-foreground mb-1">
                              Or Upload Video File (Local Browser Cache)
                            </label>
                            <label className="w-full inline-flex items-center justify-center gap-2 cursor-pointer rounded-lg bg-primary px-4 py-2.5 font-mono text-xs font-semibold text-primary-foreground hover:opacity-90 transition-all shadow-sm">
                              <Upload className="size-4" />
                              {editingProject?.videoUrl ? "Choose New Video File" : "Upload Video File"}
                              <input
                                type="file"
                                accept="video/*,.mp4,.webm,.mov,.m4v,.mkv"
                                onChange={handleVideoFileUpload}
                                className="hidden"
                              />
                            </label>
                          </div>

                          <div>
                            <label className="block font-mono text-[10px] uppercase text-muted-foreground mb-1">
                              Video Aspect Ratio Format
                            </label>
                            <select
                              value={editingProject?.aspectRatio || "9:16"}
                              onChange={(e) =>
                                setEditingProject({
                                  ...editingProject,
                                  aspectRatio: e.target.value as any,
                                })
                              }
                              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-xs font-mono text-foreground font-semibold"
                            >
                              <option value="9:16">📱 9:16 Vertical (TikTok, Reels, Shorts)</option>
                              <option value="16:9">💻 16:9 Landscape (YouTube, Desktop Film)</option>
                              <option value="1:1">⬛ 1:1 Square (Instagram Feed)</option>
                              <option value="4:5">🖼️ 4:5 Vertical Feed</option>
                              <option value="Auto">✨ Auto (Natural Ratio)</option>
                            </select>
                          </div>
                        </div>

                        {/* Inline Video Preview Player */}
                        {editingProject?.videoUrl ? (
                          <div className="mt-2 rounded-xl border border-border bg-black p-3 flex flex-col items-center">
                            <p className="font-mono text-[10px] uppercase text-muted-foreground mb-2 self-start flex items-center gap-1.5">
                              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                              Video Loaded ({editingProject.aspectRatio || "9:16"} format) — Live Preview:
                            </p>
                            <div
                              className={`relative overflow-hidden rounded-lg bg-black/90 w-full flex items-center justify-center ${
                                editingProject.aspectRatio === "9:16"
                                  ? "max-w-[220px] aspect-[9/16]"
                                  : editingProject.aspectRatio === "1:1"
                                  ? "max-w-[280px] aspect-square"
                                  : editingProject.aspectRatio === "4:5"
                                  ? "max-w-[240px] aspect-[4/5]"
                                  : "max-w-full aspect-video"
                              }`}
                            >
                              <video
                                src={editingProject.videoUrl}
                                controls
                                controlsList="nodownload noplaybackrate"
                                onContextMenu={(e) => e.preventDefault()}
                                playsInline
                                className="size-full object-contain bg-black rounded"
                              />
                            </div>
                          </div>
                        ) : (
                          <p className="text-xs text-muted-foreground font-mono text-center pt-1">
                            Click above to choose an MP4/WebM/MOV video file from your computer.
                          </p>
                        )}
                      </div>

                      {/* Demo Link (For Web / Non-Video projects) */}
                      {editingProject?.category !== "Video / Editing" && (
                        <div className="sm:col-span-2">
                          <label className="block font-mono text-[10px] uppercase text-muted-foreground mb-1">
                            Live Project / Website Demo Link
                          </label>
                          <input
                            type="text"
                            value={editingProject?.link || ""}
                            onChange={(e) =>
                              setEditingProject({ ...editingProject, link: e.target.value })
                            }
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
                            placeholder="https://example.com"
                          />
                        </div>
                      )}

                      <div className="flex items-center gap-6 pt-3 sm:col-span-2 border-t border-border">
                        <div>
                          <label className="block font-mono text-[10px] uppercase text-muted-foreground mb-1">
                            Visibility Status
                          </label>
                          <select
                            value={editingProject?.visibility || "Published"}
                            onChange={(e) =>
                              setEditingProject({
                                ...editingProject,
                                visibility: e.target.value as ProjectVisibility,
                              })
                            }
                            className="rounded-md border border-input bg-background px-3 py-1.5 text-xs font-mono text-foreground"
                          >
                            <option value="Published">👁️ Published (Visible)</option>
                            <option value="Hidden">🙈 Hidden (Invisible)</option>
                          </select>
                        </div>

                        <div className="flex items-center gap-2 pt-4">
                          <input
                            type="checkbox"
                            id="featuredCheck"
                            checked={editingProject?.featured ?? true}
                            onChange={(e) =>
                              setEditingProject({ ...editingProject, featured: e.target.checked })
                            }
                            className="size-4 rounded border-input"
                          />
                          <label
                            htmlFor="featuredCheck"
                            className="font-mono text-xs text-foreground cursor-pointer flex items-center gap-1"
                          >
                            <Star className="size-3.5 text-amber-400 fill-amber-400" /> Mark as
                            Featured Project
                          </label>
                        </div>
                      </div>

                      <div className="sm:col-span-2 flex justify-end gap-3 pt-3">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingProject(null);
                            setIsAddingProject(false);
                          }}
                          className="rounded-md border border-border px-4 py-2 font-mono text-xs text-muted-foreground hover:bg-secondary"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="rounded-md bg-primary px-5 py-2 font-mono text-xs font-semibold text-primary-foreground hover:opacity-90 shadow"
                        >
                          Save Project Changes
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Projects List Grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {projects
                    .filter((p) => {
                      if (
                        selectedCategoryFilter !== "All" &&
                        p.category !== selectedCategoryFilter
                      ) {
                        return false;
                      }
                      if (!searchQuery) return true;
                      const q = searchQuery.toLowerCase();
                      return (
                        p.title.toLowerCase().includes(q) ||
                        p.category.toLowerCase().includes(q) ||
                        p.description.toLowerCase().includes(q)
                      );
                    })
                    .map((proj) => {
                      const isHidden = proj.visibility === "Hidden";

                      return (
                        <div
                          key={proj.id}
                          className={`rounded-xl border bg-card overflow-hidden shadow-sm flex flex-col justify-between transition-all ${
                            isHidden
                              ? "border-dashed border-amber-500/40 opacity-75 bg-muted/30"
                              : "border-border"
                          }`}
                        >
                          <div className="relative">
                            {proj.image ? (
                              <div className="h-40 w-full overflow-hidden bg-muted">
                                <img
                                  src={proj.image}
                                  alt={proj.title}
                                  className="size-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="h-36 w-full bg-secondary flex items-center justify-center font-mono text-xs text-muted-foreground">
                                No Preview Image
                              </div>
                            )}

                            {/* Badges Overlay */}
                            <div className="absolute left-2.5 top-2.5 flex items-center gap-1.5 flex-wrap">
                              <span className="rounded bg-background/90 backdrop-blur-md border border-border px-2 py-0.5 font-bebas text-xs uppercase tracking-wider text-primary font-bold">
                                {proj.category}
                              </span>

                              {isHidden ? (
                                <span className="rounded bg-amber-500/90 text-slate-950 px-2 py-0.5 font-mono text-[9px] font-bold uppercase flex items-center gap-1">
                                  <EyeOff className="size-2.5" /> Hidden
                                </span>
                              ) : (
                                <span className="rounded bg-emerald-500/90 text-slate-950 px-2 py-0.5 font-mono text-[9px] font-bold uppercase flex items-center gap-1">
                                  <Eye className="size-2.5" /> Published
                                </span>
                              )}

                              {proj.featured && (
                                <span className="rounded bg-amber-400 text-slate-950 px-1.5 py-0.5 font-mono text-[9px] font-bold">
                                  ★ Featured
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                            <div>
                              <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground">
                                <span>ID: {proj.id}</span>
                                <span>{proj.createdAt}</span>
                              </div>
                              <h3 className="mt-1 font-bebas text-xl sm:text-2xl uppercase tracking-wider text-foreground">
                                {proj.title}
                              </h3>
                              <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                                {proj.description}
                              </p>
                            </div>

                            <div className="flex items-center justify-between border-t border-border pt-3">
                              <a
                                href={proj.link || "#"}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 font-mono text-[11px] text-primary hover:underline"
                              >
                                Link <ExternalLink className="size-3" />
                              </a>

                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleToggleVisibility(proj.id)}
                                  className={`rounded p-1.5 transition-colors ${
                                    isHidden
                                      ? "text-amber-500 hover:bg-amber-500/10"
                                      : "text-emerald-500 hover:bg-emerald-500/10"
                                  }`}
                                  title={isHidden ? "Make Published" : "Make Hidden"}
                                >
                                  {isHidden ? (
                                    <EyeOff className="size-4" />
                                  ) : (
                                    <Eye className="size-4" />
                                  )}
                                </button>

                                <button
                                  onClick={() => handleToggleFeatured(proj.id)}
                                  className={`rounded p-1.5 transition-colors ${
                                    proj.featured
                                      ? "text-amber-400 fill-amber-400 hover:bg-amber-400/10"
                                      : "text-muted-foreground hover:bg-secondary"
                                  }`}
                                  title={proj.featured ? "Unmark Featured" : "Mark Featured"}
                                >
                                  <Star
                                    className={`size-4 ${proj.featured ? "fill-amber-400" : ""}`}
                                  />
                                </button>

                                <button
                                  onClick={() => {
                                    setIsAddingProject(false);
                                    setEditingProject(proj);
                                  }}
                                  className="rounded p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
                                  title="Edit Project"
                                >
                                  <Edit3 className="size-4" />
                                </button>

                                <button
                                  onClick={() => handleDeleteProject(proj.id, proj.title)}
                                  className="rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                                  title="Delete Project"
                                >
                                  <Trash2 className="size-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* TAB: STUDIO ROADMAP */}
            {activeTab === "roadmap" && (
              <div className="space-y-6 max-w-6xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
                  <div>
                    <p className="eyebrow">Future Vision &amp; Deliverables</p>
                    <h1 className="font-bebas text-3xl sm:text-4xl uppercase tracking-wider text-foreground">
                      Studio Roadmap &amp; Pipeline
                    </h1>
                  </div>
                </div>

                <div className="rounded-2xl border border-border bg-card p-2 sm:p-4 shadow-xs">
                  <Roadmap />
                </div>
              </div>
            )}

            {/* TAB 3: INQUIRIES & LEADS */}
            {activeTab === "inquiries" && (
              <div className="space-y-6 max-w-6xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="eyebrow">Client Communications</p>
                    <h1 className="font-bebas text-3xl sm:text-4xl uppercase tracking-wider text-foreground">
                      Inquiries &amp; Leads
                    </h1>
                  </div>

                  {/* Search and Filters */}
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-2.5 size-3.5 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Search leads..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="rounded-lg border border-input bg-background pl-9 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>

                    <div className="flex items-center gap-1 rounded-full bg-secondary/80 p-1 border border-border">
                      {(["All", "New", "Replied", "Archived"] as const).map((st) => (
                        <button
                          key={st}
                          onClick={() => setInquiryFilter(st)}
                          className={`rounded-full px-3 py-1 font-bebas text-xs sm:text-sm tracking-wider transition-all ${
                            inquiryFilter === st
                              ? "bg-primary text-primary-foreground shadow-xs"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Inquiries Table */}
                <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
                  {filteredInquiries.length === 0 ? (
                    <div className="p-12 text-center text-muted-foreground font-mono text-xs">
                      No matching inquiries found.
                    </div>
                  ) : (
                    <div className="divide-y divide-border">
                      {filteredInquiries.map((inq) => (
                        <div
                          key={inq.id}
                          className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-secondary/40 transition-colors"
                        >
                          <div className="space-y-1 max-w-xl">
                            <div className="flex items-center gap-2">
                              <span
                                className={`rounded px-2 py-0.5 font-mono text-[9px] uppercase font-bold ${
                                  inq.status === "New"
                                    ? "bg-primary text-primary-foreground"
                                    : inq.status === "Replied"
                                      ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                                      : "bg-muted text-muted-foreground"
                                }`}
                              >
                                {inq.status}
                              </span>
                              <span className="font-mono text-[10px] text-muted-foreground">
                                {inq.date}
                              </span>
                              <span className="font-mono text-[10px] text-primary font-semibold">
                                [{inq.service}]
                              </span>
                            </div>

                            <p className="font-display text-base text-foreground flex items-center gap-2 flex-wrap">
                              {inq.name}{" "}
                              <span className="font-sans text-xs text-muted-foreground font-normal">
                                &lt;{inq.email}&gt;
                              </span>
                              {inq.phone && (
                                <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                                  📱 Phone/WA: {inq.phone}
                                </span>
                              )}
                            </p>

                            <p className="text-xs text-foreground/90 leading-relaxed bg-background/50 p-2.5 rounded-md border border-border/60">
                              "{inq.message}"
                            </p>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {inq.status !== "Replied" && (
                              <button
                                onClick={() => handleInquiryStatus(inq.id, "Replied")}
                                className="inline-flex items-center gap-1 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 font-mono text-[10px] font-medium text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20"
                              >
                                <Check className="size-3" /> Mark Replied
                              </button>
                            )}

                            {inq.status !== "Archived" && (
                              <button
                                onClick={() => handleInquiryStatus(inq.id, "Archived")}
                                className="inline-flex items-center gap-1 rounded-md border border-border bg-secondary px-2.5 py-1 font-mono text-[10px] text-muted-foreground hover:bg-muted hover:text-foreground"
                              >
                                <Archive className="size-3" /> Archive
                              </button>
                            )}

                            {inq.phone ? (
                              <a
                                href={`https://wa.me/${inq.phone.replace(/\D/g, "")}?text=${encodeURIComponent(
                                  `Hi ${inq.name}! Regarding your VisezWorks project inquiry for ${inq.service}: "${inq.message}"`,
                                )}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-2.5 py-1 font-mono text-[10px] font-bold text-white hover:bg-emerald-500 transition-colors shadow-xs"
                                title={`Chat with ${inq.name} on WhatsApp (${inq.phone})`}
                              >
                                WhatsApp Client
                              </a>
                            ) : (
                              <a
                                href={`https://wa.me/916309079282?text=${encodeURIComponent(
                                  `Hi ${inq.name}! Regarding your VisezWorks inquiry for ${inq.service}: "${inq.message}"`,
                                )}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-2.5 py-1 font-mono text-[10px] font-bold text-white hover:bg-emerald-500 transition-colors shadow-xs"
                              >
                                WhatsApp Reply
                              </a>
                            )}

                            <a
                              href={`mailto:${inq.email}?subject=Regarding your VisezWorks inquiry`}
                              className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1 font-mono text-[10px] font-semibold text-primary-foreground hover:opacity-90"
                            >
                              <Mail className="size-3" /> Email Reply
                            </a>

                            <button
                              onClick={() => handleDeleteInquiry(inq.id)}
                              className="rounded p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                              title="Delete Inquiry"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 4: SITE CONFIGURATION */}
            {activeTab === "settings" && (
              <div className="space-y-6 max-w-3xl mx-auto">
                <div>
                  <p className="eyebrow">Studio Preferences</p>
                  <h1 className="font-bebas text-3xl sm:text-4xl uppercase tracking-wider text-foreground">
                    Site Configuration
                  </h1>
                </div>

                {savedSuccessNotice && (
                  <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-2 font-mono">
                    <CheckCircle2 className="size-4" /> {savedSuccessNotice}
                  </div>
                )}

                <form
                  onSubmit={handleSaveSettings}
                  className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-5"
                >
                  <div>
                    <label className="block font-mono text-[10px] uppercase text-muted-foreground mb-1">
                      Agency Name
                    </label>
                    <input
                      type="text"
                      value={settingsForm.agencyName}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, agencyName: e.target.value })
                      }
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] uppercase text-muted-foreground mb-1">
                      Current Agency Status Badge
                    </label>
                    <input
                      type="text"
                      value={settingsForm.agencyStatus}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, agencyStatus: e.target.value })
                      }
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
                      placeholder="e.g. Taking new client projects for Q3"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] uppercase text-muted-foreground mb-1">
                      Primary Contact Email
                    </label>
                    <input
                      type="email"
                      value={settingsForm.contactEmail}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, contactEmail: e.target.value })
                      }
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] uppercase text-muted-foreground mb-1">
                      Hero Subtitle Tagline
                    </label>
                    <input
                      type="text"
                      value={settingsForm.heroSubtitle}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, heroSubtitle: e.target.value })
                      }
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] uppercase text-muted-foreground mb-1">
                      Hero Description Paragraph
                    </label>
                    <textarea
                      rows={3}
                      value={settingsForm.heroDescription}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, heroDescription: e.target.value })
                      }
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block font-mono text-[10px] uppercase text-muted-foreground mb-1">
                        Total Projects Completed
                      </label>
                      <input
                        type="number"
                        value={settingsForm.totalProjectsCompleted}
                        onChange={(e) =>
                          setSettingsForm({
                            ...settingsForm,
                            totalProjectsCompleted: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-[10px] uppercase text-muted-foreground mb-1">
                        Client Satisfaction Rate (%)
                      </label>
                      <input
                        type="number"
                        max={100}
                        value={settingsForm.clientSatisfactionRate}
                        onChange={(e) =>
                          setSettingsForm({
                            ...settingsForm,
                            clientSatisfactionRate: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border flex justify-end">
                    <button
                      type="submit"
                      className="rounded-lg bg-primary px-6 py-2.5 font-mono text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
                    >
                      Save Configuration
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB 5: ACTIVITY LOGS */}
            {activeTab === "logs" && (
              <div className="space-y-6 max-w-4xl mx-auto">
                <div>
                  <p className="eyebrow">Audit Trail</p>
                  <h1 className="font-bebas text-3xl sm:text-4xl uppercase tracking-wider text-foreground">
                    Admin Activity Logs
                  </h1>
                </div>

                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                  <div className="space-y-4">
                    {logs.map((log) => (
                      <div
                        key={log.id}
                        className="flex items-start justify-between gap-4 border-b border-border/60 pb-3 text-xs"
                      >
                        <div className="space-y-1">
                          <p className="font-mono font-bold text-foreground">{log.action}</p>
                          <p className="text-muted-foreground">{log.details}</p>
                        </div>
                        <span className="font-mono text-[10px] text-muted-foreground shrink-0 bg-secondary px-2 py-1 rounded">
                          {log.timestamp}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      )}
    </div>
  );
}
