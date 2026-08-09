import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { VisezWorksIcon } from "./logo";
import { useBackgroundToggle } from "@/lib/background-store";

const ROTATION = ["DIGITAL.", "WEBSITES.", "STORIES.", "IMPACT."];

const CLIENTS = [
  "LANDING PAGES",
  "BUSINESS SITES",
  "SHORT-FORM",
  "PROMOS",
  "PORTFOLIOS",
  "MOTION EDITS",
  "WEB EXPERIENCES",
  "SOCIAL CONTENT",
];

function Badge() {
  return (
    <div className="relative size-[132px] shrink-0 sm:size-[150px]">
      <div className="absolute inset-0 rounded-full bg-card shadow-[0_10px_40px_-24px_rgba(0,0,0,0.45)] ring-1 ring-border" />
      <svg viewBox="0 0 100 100" className="absolute inset-0 animate-spin-slow">
        <defs>
          <path id="badge-arc" d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" />
        </defs>
        <text className="fill-foreground font-bebas text-xs uppercase tracking-[0.16em]">
          <textPath href="#badge-arc" startOffset="0%">
            Web Development • Video Editing •
          </textPath>
        </text>
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <VisezWorksIcon className="h-12 sm:h-14 w-auto" />
      </div>
    </div>
  );
}

function Toggle() {
  const { enabled, toggle } = useBackgroundToggle();
  return (
    <button
      onClick={toggle}
      aria-label="Toggle background mode"
      title={
        enabled
          ? "Interactive BG ON (Click for Static Image BG)"
          : "Static Image BG OFF (Click for Interactive BG)"
      }
      className="relative inline-flex h-[0.52em] w-[0.98em] shrink-0 cursor-pointer items-center rounded-full p-[0.05em] align-middle transition-colors duration-500"
      style={{
        background: enabled
          ? "linear-gradient(160deg, oklch(0.663 0.226 36), oklch(0.44 0.16 34))"
          : "linear-gradient(160deg, oklch(0.5 0.01 265), oklch(0.3 0.012 265))",
        boxShadow:
          "inset 0 0.04em 0.06em rgba(255,255,255,0.28), inset 0 -0.05em 0.08em rgba(0,0,0,0.4), 0 0.08em 0.18em rgba(0,0,0,0.22)",
      }}
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 500, damping: 34 }}
        className="size-[0.42em] rounded-full"
        style={{
          marginLeft: enabled ? "auto" : 0,
          background: "radial-gradient(circle at 35% 28%, #ffffff, #e2e2e2 60%, #b4b4b4)",
          boxShadow: "0 0.04em 0.1em rgba(0,0,0,0.4)",
        }}
      />
    </button>
  );
}

export function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % ROTATION.length), 2800);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="home" className="relative overflow-hidden pt-28 pb-14 sm:pt-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-10">
        <div className="flex items-start justify-between gap-6">
          <div className="min-w-0 flex-1">
            {/* dotted eyebrow line */}
            <motion.h2
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-[7vw] leading-none tracking-[-0.02em] sm:text-[4.2vw] md:text-[3.5vw] lg:text-[3vw]"
              style={{
                WebkitTextFillColor: "transparent",
                backgroundImage: "radial-gradient(currentColor 34%, transparent 36%)",
                backgroundSize: "0.11em 0.11em",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "var(--foreground)",
              }}
            >
              WEB &amp; VIDEO
            </motion.h2>

            <span className="mt-1 block overflow-hidden">
              <motion.span
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="block font-display text-[11vw] leading-[0.88] tracking-[-0.05em] text-foreground sm:text-[8.5vw] md:text-[7.5vw] lg:text-[6.8vw] xl:text-[7.5rem]"
              >
                WE BUILD
              </motion.span>
            </span>

            {/* rotating orange line + toggle */}
            <div className="mt-1 flex flex-nowrap items-center gap-2 sm:gap-4 md:gap-6 font-display text-[10vw] leading-[0.88] tracking-[-0.05em] text-primary sm:text-[8vw] md:text-[7vw] lg:text-[6.2vw] xl:text-[7rem]">
              <span className="relative inline-block overflow-hidden whitespace-nowrap">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={ROTATION[index]}
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: "-100%", opacity: 0 }}
                    transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                    className="block whitespace-nowrap"
                  >
                    {ROTATION[index]}
                  </motion.span>
                </AnimatePresence>
              </span>
              <Toggle />
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="hidden shrink-0 md:block"
          >
            <Badge />
          </motion.div>
        </div>

        <div className="mt-8 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0 max-w-2xl">
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="text-base font-extrabold text-primary sm:text-lg"
            >
              Web development <span className="text-foreground">&amp;</span> video editing{" "}
              <span className="text-foreground">for brands, creators, and businesses.</span>
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.58, duration: 0.7 }}
              className="mt-3 max-w-xl text-[14px] leading-relaxed text-muted-foreground"
            >
              VisezWorks creates fast, modern websites and engaging video content designed to make
              brands stand out.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.66, duration: 0.7 }}
              className="mt-5 flex items-center gap-2 font-bebas text-sm sm:text-base uppercase tracking-wider text-muted-foreground"
            >
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-70" />
                <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
              </span>
              Vision • Innovate • Create
            </motion.p>
          </div>

          {/* identity block */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex items-end gap-3 self-end"
          >
            <div className="pb-4 text-left sm:text-right">
              <p className="font-bebas text-sm uppercase tracking-wider text-muted-foreground">
                Hi! We are
              </p>
              <p className="font-display text-2xl uppercase tracking-[-0.02em] text-foreground sm:text-3xl">
                Visez<span className="text-primary">Works</span>
              </p>
            </div>
            <svg
              viewBox="0 0 90 60"
              className="pointer-events-none absolute -bottom-1 right-[92px] hidden h-14 w-24 text-muted-foreground/60 sm:block"
              fill="none"
            >
              <path
                d="M2 6 C 30 4, 48 18, 46 34 C 45 46, 62 52, 86 50"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeDasharray="3 5"
                strokeLinecap="round"
              />
            </svg>
            <div className="relative grid size-[86px] shrink-0 place-items-center rounded-full bg-card ring-1 ring-border sm:size-[104px]">
              <span className="absolute -inset-1 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--primary)_28%,transparent),transparent_70%)] blur-md" />
              <VisezWorksIcon className="relative size-[60%] text-foreground" />
            </div>
          </motion.div>
        </div>

        {/* capability marquee */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="relative mt-10 overflow-hidden border-y border-border py-4 [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]"
        >
          <div className="flex w-max animate-marquee items-center gap-10 pr-10">
            {[...CLIENTS, ...CLIENTS].map((m, i) => (
              <span
                key={`${m}-${i}`}
                className="flex items-center gap-10 font-bebas text-sm sm:text-base uppercase tracking-wider text-muted-foreground transition-colors duration-300 hover:text-foreground"
              >
                {m}
                <span className="size-1 rounded-full bg-primary" />
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
