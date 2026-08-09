import { useState } from "react";
import { motion } from "motion/react";
import {
  Clock,
  CheckCircle2,
  Rocket,
  Layers,
  Sparkles,
  Calendar,
  Tag,
  ArrowRight,
  Code2,
  Video,
  Cpu,
} from "lucide-react";
import { useAdminData } from "@/lib/admin-store";

export interface RoadmapItem {
  id: string;
  title: string;
  category: "Web Development" | "Video / Editing" | "Digital Products & AI";
  phase: "In Development" | "Beta Testing" | "Planned Q3" | "Planned Q4" | "Live";
  status: "In Progress" | "Upcoming" | "Live";
  progress: number; // 0 to 100
  targetDate: string;
  description: string;
  deliverables: string[];
}

const DEFAULT_ROADMAP: RoadmapItem[] = [
  {
    id: "rm-1",
    title: "AI Studio Client Portal & Lead Pipeline",
    category: "Digital Products & AI",
    phase: "Beta Testing",
    status: "In Progress",
    progress: 85,
    targetDate: "Late August 2026",
    description:
      "Automated lead processing, instant scope estimator, and client revision tracking system built with Gemini AI.",
    deliverables: [
      "Gemini AI Chat Estimator",
      "Real-time status updates",
      "Secure client file uploads",
    ],
  },
  {
    id: "rm-2",
    title: "VisezWorks Video Editing Asset Library",
    category: "Video / Editing",
    phase: "In Development",
    progress: 60,
    status: "In Progress",
    targetDate: "September 2026",
    description:
      "A curated collection of sound effects, motion graphic overlays, and 4K kinetic typography templates for creators.",
    deliverables: [
      "25+ Kinetic text overlays",
      "SFX sound pack",
      "Drag-and-drop Premiere/DaVinci presets",
    ],
  },
  {
    id: "rm-3",
    title: "NextGen E-Commerce Web Design System",
    category: "Web Development",
    phase: "Planned Q3",
    status: "Upcoming",
    progress: 30,
    targetDate: "Q3 2026",
    description:
      "Ultra-fast headless Shopify & React storefront template with instant search and micro-interactions.",
    deliverables: ["Tailwind UI Kit", "Algolia Search integration", "Sub-second page load times"],
  },
  {
    id: "rm-4",
    title: "Automated Social Reel Generator",
    category: "Digital Products & AI",
    phase: "Planned Q4",
    status: "Upcoming",
    progress: 15,
    targetDate: "Q4 2026",
    description:
      "Convert long-form podcast audio or video into auto-captioned 60-second viral Shorts with custom typography.",
    deliverables: ["Auto-transcript AI engine", "Dynamic subtitle burning", "One-click export"],
  },
];

export function Roadmap() {
  const { projects } = useAdminData();
  const [filter, setFilter] = useState<"All" | "In Progress" | "Upcoming" | "Live">("All");

  // Filter roadmap items
  const filteredItems = DEFAULT_ROADMAP.filter((item) => {
    if (filter === "All") return true;
    return item.status === filter;
  });

  return (
    <section id="roadmap" className="py-20 relative bg-secondary/30 border-y border-border">
      <div className="mx-auto max-w-6xl px-5 sm:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="eyebrow flex items-center gap-2">
              <Sparkles className="size-3.5 text-primary" /> Future Vision &amp; Deliverables
            </p>
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-bebas text-3xl uppercase tracking-wider text-foreground sm:text-4xl"
            >
              Studio Roadmap &amp; Pipeline<span className="text-primary">.</span>
            </motion.h2>
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 rounded-full bg-card p-1 border border-border shadow-sm">
            {(["All", "In Progress", "Upcoming"] as const).map((st) => (
              <button
                key={st}
                onClick={() => setFilter(st)}
                className={`rounded-full px-4 py-1.5 font-bebas text-sm sm:text-base tracking-wider transition-all duration-300 ${
                  filter === st
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline Grid */}
        <div className="mt-12 relative before:absolute before:inset-0 before:left-4 sm:before:left-1/2 before:-ml-px before:w-0.5 before:bg-border before:hidden md:before:block">
          <div className="space-y-8">
            {filteredItems.map((item, index) => {
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative flex flex-col md:flex-row items-stretch gap-6"
                >
                  {/* Timeline Card */}
                  <div className="flex-1 rounded-2xl border border-border bg-card p-6 shadow-sm hover:border-primary/40 transition-all duration-300 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 rounded bg-primary/10 border border-primary/20 px-2 py-0.5 font-bebas text-xs uppercase tracking-wider text-primary">
                          {item.category === "Web Development" && <Code2 className="size-3" />}
                          {item.category === "Video / Editing" && <Video className="size-3" />}
                          {item.category === "Digital Products & AI" && <Cpu className="size-3" />}
                          {item.category}
                        </span>
                        <span className="rounded bg-secondary px-2 py-0.5 font-bebas text-xs text-muted-foreground uppercase tracking-wider">
                          {item.phase}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 font-bebas text-sm text-muted-foreground tracking-wider">
                        <Calendar className="size-3.5 text-primary" />
                        <span>{item.targetDate}</span>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bebas text-xl sm:text-2xl uppercase tracking-wide text-foreground">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between font-bebas text-sm sm:text-base tracking-wider">
                        <span className="text-muted-foreground">Development Progress</span>
                        <span className="font-bold text-primary">{item.progress}%</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                        <div
                          className="h-full rounded-full bg-primary transition-all duration-1000"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Key Deliverables */}
                    <div className="pt-2 border-t border-border/60">
                      <p className="font-bebas text-xs uppercase tracking-wider text-muted-foreground mb-2">
                        Key Scope Deliverables
                      </p>
                      <ul className="grid gap-1.5 sm:grid-cols-3">
                        {item.deliverables.map((deliv) => (
                          <li
                            key={deliv}
                            className="flex items-center gap-1.5 text-[11px] text-foreground/80 font-sans"
                          >
                            <CheckCircle2 className="size-3 text-primary shrink-0" />
                            <span className="truncate">{deliv}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
