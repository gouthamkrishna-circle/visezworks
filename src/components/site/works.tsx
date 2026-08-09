import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowUpRight,
  Play,
  Star,
  ExternalLink,
  X,
  Sparkles,
  Filter,
  Layers,
  Search,
} from "lucide-react";
import { useAdminData, ProjectItem, PROJECT_CATEGORIES, ProjectCategory } from "@/lib/admin-store";
import { usePlayableVideoUrl } from "@/lib/media-storage";

const CAPABILITIES = [
  {
    label: "Web Development",
    items: [
      "Landing pages & CMS",
      "Business platforms",
      "Portfolio & showcase sites",
      "Interactive web apps",
    ],
  },
  {
    label: "Video / Editing",
    items: [
      "Short-form viral edits",
      "Promotional launch films",
      "Motion graphics & typography",
      "Reels & TikTok pacing",
    ],
  },
  {
    label: "Digital Products & AI",
    items: [
      "UI design systems",
      "Automated lead pipelines",
      "Gemini AI support bots",
      "Social campaign kits",
    ],
  },
];

export function Works() {
  const { projects, categories } = useAdminData();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeModalProject, setActiveModalProject] = useState<ProjectItem | null>(null);

  // Strictly filter out hidden projects for customer view
  const publishedProjects = projects.filter((p) => p.visibility !== "Hidden");

  // Determine active project list based on selected category tab & search query
  const getFilteredProjects = () => {
    let list = publishedProjects;

    if (selectedCategory === "Featured") {
      list = list.filter((p) => p.featured);
    } else if (selectedCategory !== "All") {
      list = list.filter((p) => p.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query),
      );
    }

    return list;
  };

  const currentList = getFilteredProjects();

  return (
    <section id="works" className="py-24 relative overflow-hidden bg-background/50">
      <div className="mx-auto max-w-7xl px-5 sm:px-10">
        <div className="space-y-4">
          <p className="eyebrow flex items-center gap-2">
            <Sparkles className="size-3.5 text-primary" /> Curated Studio Showcase
          </p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-[12vw] uppercase leading-[0.86] tracking-[-0.04em] text-foreground sm:text-[5rem]"
          >
            What we&rsquo;ve made<span className="text-primary">.</span>
          </motion.h2>

          <p className="max-w-md text-xs sm:text-sm text-muted-foreground leading-relaxed font-sans">
            Explore our categorized portfolio of custom web builds, video edits, digital products,
            automation pipelines, and AI systems.
          </p>
        </div>

        {/* Search & Keyword Filtering Toolbar */}
        <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 rounded-2xl border border-border/80 bg-card/60 p-2 sm:p-3 backdrop-blur-md shadow-xs">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects by name, technology (e.g., React, Gemini, Video), or category..."
              className="w-full rounded-xl bg-secondary/80 pl-10 pr-10 py-2.5 font-sans text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/70 border border-transparent focus:border-primary/50 focus:bg-background focus:outline-none transition-all duration-200"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                title="Clear search"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          {searchQuery.trim() && (
            <div className="flex items-center gap-2 px-2 font-bebas text-sm text-muted-foreground shrink-0">
              <span className="rounded-md bg-primary/10 border border-primary/20 px-2.5 py-1 text-primary font-bold">
                {currentList.length} Result{currentList.length === 1 ? "" : "s"}
              </span>
              <button
                onClick={() => setSearchQuery("")}
                className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2"
              >
                Reset Search
              </button>
            </div>
          )}
        </div>

        {/* Category Navigation & Filtering Tabs with Keyboard Navigation */}
        <div className="mt-12 overflow-x-auto pb-3 pt-1 scrollbar-none">
          <div
            role="tablist"
            aria-label="Portfolio category filter"
            className="flex items-center gap-2 min-w-max"
            onKeyDown={(e) => {
              const allCategories = ["All", "Featured", ...categories];
              const currentIndex = allCategories.indexOf(selectedCategory);
              let nextIndex = currentIndex;

              if (e.key === "ArrowRight") {
                e.preventDefault();
                nextIndex = (currentIndex + 1) % allCategories.length;
              } else if (e.key === "ArrowLeft") {
                e.preventDefault();
                nextIndex = (currentIndex - 1 + allCategories.length) % allCategories.length;
              } else if (e.key === "Home") {
                e.preventDefault();
                nextIndex = 0;
              } else if (e.key === "End") {
                e.preventDefault();
                nextIndex = allCategories.length - 1;
              }

              if (nextIndex !== currentIndex) {
                const newCat = allCategories[nextIndex]!;
                setSelectedCategory(newCat);
                const nextTab = document.getElementById(
                  `tab-${newCat.toLowerCase().replace(/\s+/g, "-")}`,
                );
                nextTab?.focus();
              }
            }}
          >
            <button
              id="tab-all"
              role="tab"
              aria-selected={selectedCategory === "All"}
              aria-controls="portfolio-projects-grid"
              tabIndex={selectedCategory === "All" ? 0 : -1}
              onClick={() => setSelectedCategory("All")}
              className={`inline-flex items-center gap-2 rounded-full px-4.5 py-2 font-bebas text-sm sm:text-base tracking-wider transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary ${
                selectedCategory === "All"
                  ? "bg-primary text-primary-foreground shadow-md scale-105"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              <Layers className="size-3.5" /> All Work ({publishedProjects.length})
            </button>

            <button
              id="tab-featured"
              role="tab"
              aria-selected={selectedCategory === "Featured"}
              aria-controls="portfolio-projects-grid"
              tabIndex={selectedCategory === "Featured" ? 0 : -1}
              onClick={() => setSelectedCategory("Featured")}
              className={`inline-flex items-center gap-2 rounded-full px-4.5 py-2 font-bebas text-sm sm:text-base tracking-wider transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary ${
                selectedCategory === "Featured"
                  ? "bg-primary text-primary-foreground shadow-md scale-105"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              <Star className="size-3.5 text-amber-400 fill-amber-400" /> Featured (
              {publishedProjects.filter((p) => p.featured).length})
            </button>

            <span className="h-4 w-px bg-border mx-1" aria-hidden="true" />

            {categories.map((cat) => {
              const count = publishedProjects.filter((p) => p.category === cat).length;
              const isSelected = selectedCategory === cat;
              const tabId = `tab-${cat.toLowerCase().replace(/\s+/g, "-")}`;

              return (
                <button
                  key={cat}
                  id={tabId}
                  role="tab"
                  aria-selected={isSelected}
                  aria-controls="portfolio-projects-grid"
                  tabIndex={isSelected ? 0 : -1}
                  onClick={() => setSelectedCategory(cat)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-4.5 py-2 font-bebas text-sm sm:text-base tracking-wider transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary ${
                    isSelected
                      ? "bg-primary text-primary-foreground shadow-md scale-105"
                      : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Display Mode: Isolated Category View vs All Grouped View */}
        {selectedCategory !== "All" ? (
          /* SINGLE CATEGORY VIEW - STRICTLY SHOW ONLY THIS CATEGORY */
          <div className="mt-10">
            <div className="mb-6 flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-display text-xl uppercase tracking-tight text-foreground flex items-center gap-2">
                <span className="size-2 rounded-full bg-primary" />
                {selectedCategory}
              </h3>
              <span className="font-bebas text-sm sm:text-base text-muted-foreground">
                Showing {currentList.length} project{currentList.length === 1 ? "" : "s"}
              </span>
            </div>

            {currentList.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center my-8">
                <Filter className="size-8 text-muted-foreground mx-auto mb-3 opacity-60" />
                <p className="font-display text-lg uppercase text-foreground">
                  No Published Projects Yet
                </p>
                <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                  There are currently no active projects listed under {selectedCategory}. Check back
                  soon or visit our Admin Panel to publish items.
                </p>
              </div>
            ) : (
              <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                {currentList.map((project, idx) => (
                  <ProjectCard
                    key={project.id || project.title}
                    project={project}
                    index={idx}
                    onOpenModal={() => setActiveModalProject(project)}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* ALL CATEGORIES VIEW - DISTINCT CATEGORY SECTIONS */
          <div className="mt-12 space-y-16">
            {PROJECT_CATEGORIES.map((cat, catIdx) => {
              const catProjects = publishedProjects.filter((p) => p.category === cat);
              if (catProjects.length === 0) return null;

              return (
                <div key={cat} className="space-y-6">
                  <div className="flex items-center gap-4">
                    <span className="font-bebas text-base sm:text-lg uppercase tracking-wider text-foreground font-semibold flex items-center gap-2">
                      <span className="text-primary">0{catIdx + 1}</span> — {cat}
                    </span>
                    <span className="h-px flex-1 bg-border" />
                    <button
                      onClick={() => setSelectedCategory(cat)}
                      className="font-bebas text-sm uppercase text-primary hover:underline flex items-center gap-1 tracking-wider"
                    >
                      View Category ({catProjects.length}) <ArrowUpRight className="size-3" />
                    </button>
                  </div>

                  <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                    {catProjects.map((project, idx) => (
                      <ProjectCard
                        key={project.id || project.title}
                        project={project}
                        index={idx}
                        onOpenModal={() => setActiveModalProject(project)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Compact capabilities footer */}
        <div className="mt-24 grid gap-10 border-t border-border pt-12 sm:grid-cols-3">
          {CAPABILITIES.map((c) => (
            <div key={c.label}>
              <h3 className="font-display text-sm uppercase tracking-[0.14em] text-foreground flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-primary" />
                {c.label}
              </h3>
              <ul className="mt-4 space-y-2">
                {c.items.map((it) => (
                  <li
                    key={it}
                    className="flex items-center gap-3 text-[13.5px] text-muted-foreground"
                  >
                    <span className="size-1 rounded-full bg-primary/60" />
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* PROJECT DETAILS & PREVIEW MODAL */}
      <AnimatePresence>
        {activeModalProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl relative space-y-5"
            >
              <button
                onClick={() => setActiveModalProject(null)}
                className="absolute right-4 top-4 z-20 rounded-full bg-background/80 p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                title="Close modal"
              >
                <X className="size-5" />
              </button>

              {/* Media Section: Direct Video Player or Image */}
              <div
                className={`relative overflow-hidden rounded-xl border border-border bg-black mx-auto flex items-center justify-center ${
                  activeModalProject.aspectRatio === "9:16" ||
                  (activeModalProject.category === "Video / Editing" && activeModalProject.aspectRatio !== "16:9" && activeModalProject.aspectRatio !== "1:1")
                    ? "max-w-[350px] aspect-[9/16] max-h-[580px] shadow-2xl"
                    : activeModalProject.aspectRatio === "1:1"
                    ? "max-w-[420px] aspect-square"
                    : activeModalProject.aspectRatio === "4:5"
                    ? "max-w-[380px] aspect-[4/5]"
                    : "w-full aspect-video"
                }`}
              >
                {activeModalProject.videoUrl ? (
                  <ProjectVideoPlayer
                    videoUrl={activeModalProject.videoUrl}
                    controls={true}
                    autoPlay={true}
                    className="size-full object-contain bg-black"
                  />
                ) : activeModalProject.image ? (
                  <img
                    src={activeModalProject.image}
                    alt={activeModalProject.title}
                    className="size-full object-cover"
                  />
                ) : (
                  <div className="size-full bg-secondary flex items-center justify-center font-bebas text-sm text-muted-foreground tracking-wider">
                    No Media Preview Available
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded bg-primary/10 border border-primary/20 px-2.5 py-0.5 font-bebas text-xs sm:text-sm uppercase tracking-wider text-primary">
                    {activeModalProject.category}
                  </span>
                  {activeModalProject.featured && (
                    <span className="rounded bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 font-bebas text-xs sm:text-sm uppercase tracking-wider text-amber-500 flex items-center gap-1">
                      <Star className="size-3 fill-amber-500" /> Featured Work
                    </span>
                  )}
                  <span className="font-bebas text-xs sm:text-sm text-muted-foreground ml-auto tracking-wider">
                    Added {activeModalProject.createdAt}
                  </span>
                </div>

                <h2 className="font-display text-2xl sm:text-3xl uppercase tracking-tight text-foreground">
                  {activeModalProject.title}
                </h2>

                <p className="text-sm text-foreground/90 leading-relaxed font-sans">
                  {activeModalProject.description}
                </p>

                {activeModalProject.details && (
                  <div className="rounded-lg border border-border/80 bg-secondary/50 p-4 space-y-1.5">
                    <p className="font-bebas text-xs sm:text-sm uppercase tracking-wider text-muted-foreground">
                      Project Details &amp; Scope
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {activeModalProject.details}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between border-t border-border pt-4">
                <button
                  onClick={() => setActiveModalProject(null)}
                  className="rounded-lg border border-border px-4 py-2 font-bebas text-sm text-muted-foreground hover:bg-secondary tracking-wider"
                >
                  Close Showcase
                </button>

                {activeModalProject.link && activeModalProject.category !== "Video / Editing" && (
                  <a
                    href={activeModalProject.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2 font-bebas text-sm sm:text-base uppercase text-primary-foreground hover:opacity-90 transition-all shadow-sm tracking-wider"
                  >
                    Visit Live Website <ExternalLink className="size-3.5" />
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

function ProjectCard({
  project,
  index,
  onOpenModal,
}: {
  project: ProjectItem;
  index: number;
  onOpenModal: () => void;
}) {
  const isVideo = project.category === "Video / Editing" || !!project.videoUrl;
  const is916 = project.aspectRatio === "9:16" || (project.category === "Video / Editing" && project.aspectRatio !== "16:9" && project.aspectRatio !== "1:1");

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, scale: 1.015 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="group cursor-pointer block rounded-2xl p-3 border border-transparent hover:border-primary/30 hover:bg-card/60 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10"
      onClick={onOpenModal}
    >
      <div
        className={`relative overflow-hidden rounded-xl border border-border bg-secondary shadow-sm transition-all duration-300 group-hover:border-primary/50 group-hover:shadow-xl ${
          is916
            ? "aspect-[9/16] max-h-[480px] mx-auto"
            : project.aspectRatio === "1:1"
            ? "aspect-square"
            : project.aspectRatio === "4:5"
            ? "aspect-[4/5]"
            : project.aspectRatio === "16:9"
            ? "aspect-video"
            : isVideo
            ? "aspect-[9/16] max-h-[480px] mx-auto"
            : "aspect-[4/3]"
        }`}
      >
        {project.videoUrl ? (
          <ProjectVideoPlayer
            videoUrl={project.videoUrl}
            posterImage={project.image}
            autoPlay={true}
            controls={false}
            className="size-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
          />
        ) : project.image ? (
          <img
            src={project.image}
            alt={project.title}
            loading="lazy"
            className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="size-full bg-[linear-gradient(135deg,color-mix(in_oklab,var(--foreground)_8%,transparent),transparent)] transition-transform duration-700 group-hover:scale-[1.04]" />
        )}

        {/* Category, Aspect Ratio & Featured Badges */}
        <div className="absolute left-3 top-3 flex items-center gap-1.5 z-10 pointer-events-none">
          <span className="border border-border bg-card/90 backdrop-blur-md px-2.5 py-1 font-bebas text-xs uppercase tracking-wider text-foreground rounded">
            {project.category}
          </span>
          {project.featured && (
            <span className="bg-amber-500/90 text-slate-950 font-bebas text-xs uppercase tracking-wider px-2 py-1 rounded flex items-center gap-1 shadow-sm">
              <Star className="size-2.5 fill-slate-950" /> Featured
            </span>
          )}
          {project.aspectRatio && (
            <span className="bg-primary/90 text-primary-foreground font-mono text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">
              {project.aspectRatio}
            </span>
          )}
        </div>

        {/* Play Icon Overlay for Videos */}
        {isVideo && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="size-12 rounded-full bg-primary/90 text-primary-foreground flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
              <Play className="size-5 fill-primary-foreground ml-0.5" />
            </div>
          </div>
        )}
      </div>

      <div className="mt-3.5 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-base uppercase tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary">
            {project.title}
          </h3>
          <p className="mt-1 max-w-sm text-xs leading-relaxed text-muted-foreground line-clamp-2">
            {project.description}
          </p>
        </div>
        <span className="mt-0.5 hidden items-center gap-1 font-bebas text-xs uppercase tracking-wider text-muted-foreground transition-colors group-hover:text-primary sm:flex shrink-0">
          {isVideo ? "Watch Video" : "Details"} <ArrowUpRight className="size-3" />
        </span>
      </div>
    </motion.div>
  );
}

function getEmbedUrl(url: string): string | null {
  if (!url) return null;
  if (url.includes("youtube.com/watch") || url.includes("youtu.be/")) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}?autoplay=1&mute=1&loop=1&playlist=${match[2]}&controls=1`;
    }
  }
  if (url.includes("vimeo.com/")) {
    const match = url.match(/vimeo\.com\/(\d+)/);
    if (match && match[1]) {
      return `https://player.vimeo.com/video/${match[1]}?autoplay=1&muted=1&loop=1`;
    }
  }
  return null;
}

function ProjectVideoPlayer({
  videoUrl,
  posterImage,
  className,
  controls = false,
  autoPlay = true,
}: {
  videoUrl: string;
  posterImage?: string;
  className?: string;
  controls?: boolean;
  autoPlay?: boolean;
}) {
  const playableUrl = usePlayableVideoUrl(videoUrl);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(controls);
  const [isBuffering, setIsBuffering] = useState(true);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const src = playableUrl || videoUrl;
  const embedUrl = getEmbedUrl(src);

  // IntersectionObserver: load src only when scrolled into viewport
  React.useEffect(() => {
    if (controls) { setIsInView(true); return; }
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            if (autoPlay && videoRef.current) videoRef.current.play().catch(() => {});
          } else {
            if (videoRef.current && !controls) videoRef.current.pause();
          }
        });
      },
      { threshold: 0.15, rootMargin: "100px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [autoPlay, controls]);

  if (embedUrl) {
    return (
      <iframe
        src={embedUrl}
        className={className}
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
        title="Project Video Player"
      />
    );
  }

  if (hasError || !src || (src.startsWith("vid-") && !playableUrl)) {
    if (posterImage) return <img src={posterImage} alt="Video preview" className={className} />;
    return (
      <div className="size-full bg-gradient-to-br from-secondary/80 to-background flex items-center justify-center p-6 text-center">
        <div className="space-y-2">
          <div className="size-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto">
            <Play className="size-4 fill-primary ml-0.5" />
          </div>
          <p className="font-bebas text-xs uppercase text-muted-foreground tracking-wider">
            Set a video URL in Admin Panel
          </p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative size-full">
      {/* Poster shown instantly while video buffers */}
      {posterImage && isBuffering && (
        <img
          src={posterImage}
          alt="Video loading preview"
          className="absolute inset-0 size-full object-cover z-10"
          style={{ pointerEvents: "none" }}
        />
      )}

      {/* Buffering spinner — only visible when no poster but still loading */}
      {!posterImage && isBuffering && isInView && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-secondary/80">
          <div className="size-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
        </div>
      )}

      <video
        ref={videoRef}
        src={isInView ? src : undefined}
        poster={posterImage}
        controls={controls}
        controlsList="nodownload noplaybackrate"
        disablePictureInPicture
        onContextMenu={(e) => e.preventDefault()}
        onError={() => { setHasError(true); setIsBuffering(false); }}
        onCanPlay={() => { setIsBuffering(false); if (autoPlay && isInView) videoRef.current?.play().catch(() => {}); }}
        muted={!controls}
        loop
        playsInline
        preload={isInView ? "metadata" : "none"}
        style={{ transform: "translateZ(0)", willChange: "transform" }}
        className={`${className} ${isBuffering && posterImage ? "opacity-0" : "opacity-100"} transition-opacity duration-500`}
      />
    </div>
  );
}
