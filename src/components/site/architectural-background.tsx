import { useMouseParallax } from "@/hooks/use-mouse-parallax";
import { useBackgroundToggle } from "@/lib/background-store";

/**
 * BackgroundAtmosphere / ArchitecturalBackground
 * Premium, minimal, architectural background system inspired by VisezWorks visual identity.
 *
 * Features:
 * - Warm off-white / light concrete tactile base (#F4F3EF)
 * - Subtle concrete/paper noise grain texture
 * - Top-left curved architectural contour lines
 * - Right-side translucent glass & orange architectural 3D composition
 * - Bottom concrete step/block structures
 * - Left technical dot grid and orange node construction lines
 * - Smooth dampening mouse-parallax hook (60 FPS) with inverse distance scaling
 * - Responsive media queries: simplified 3D composition and disabled parallax on mobile for max legibility
 * - Toggle ON/OFF state driven by the hero toggle switch
 */
export function BackgroundAtmosphere() {
  const { enabled } = useBackgroundToggle();
  const { x, y, inverseDistance, isMobile } = useMouseParallax({
    damping: 0.05,
    maxOffset: 25,
  });

  // When enabled: dynamic parallax offsets applied.
  // When disabled: static image mode (zero offset, perfectly still background composition).
  const posX = enabled ? x : 0;
  const posY = enabled ? y : 0;
  const invDist = enabled ? inverseDistance : 1;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none bg-[#F4F3EF] dark:bg-[#18191C] transition-colors duration-700"
    >
      {/* 1. PAPER / CONCRETE NOISE TEXTURE OVERLAY */}
      <svg className="absolute inset-0 size-full opacity-[0.035] dark:opacity-[0.05] mix-blend-overlay">
        <filter id="concrete-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.7"
            numOctaves="1"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#concrete-grain)" />
      </svg>

      {/* BACKGROUND ATMOSPHERE COMPOSITION */}
      <div className="absolute inset-0">
        {/* AMBIENT SOFT RADIAL LIGHTING */}
        <div className="absolute -top-[20%] -right-[10%] size-[65vw] max-w-[900px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.85)_0%,rgba(244,243,239,0)_70%)] dark:bg-[radial-gradient(circle,rgba(255,85,0,0.06)_0%,transparent_70%)] blur-3xl pointer-events-none" />
        <div className="absolute -bottom-[20%] -left-[10%] size-[50vw] max-w-[700px] rounded-full bg-[radial-gradient(circle,rgba(249,87,0,0.05)_0%,transparent_70%)] blur-3xl pointer-events-none" />

        {/* 2. TOP-LEFT: ARCHITECTURAL CONTOUR LINES */}
        <div
          className={`absolute top-0 left-0 w-[320px] sm:w-[480px] lg:w-[600px] h-[320px] sm:h-[480px] lg:h-[600px] ${
            enabled ? "transition-transform duration-200 ease-out" : ""
          }`}
          style={{
            transform: `translate3d(${-posX * 0.4 * invDist}px, ${-posY * 0.4 * invDist}px, 0)`,
          }}
        >
          <svg
            viewBox="0 0 600 600"
            className="size-full fill-none stroke-foreground/10 dark:stroke-white/10"
          >
            {/* Concentric Arc Contour System */}
            <circle cx="-50" cy="-50" r="220" strokeWidth="1" />
            <circle cx="-50" cy="-50" r="290" strokeWidth="1" />
            <circle
              cx="-50"
              cy="-50"
              r="370"
              strokeWidth="1.2"
              strokeDasharray="4 6"
              className="stroke-primary/40 dark:stroke-primary/50"
            />
            <circle cx="-50" cy="-50" r="460" strokeWidth="1" />
            <circle cx="-50" cy="-50" r="540" strokeWidth="0.8" className="hidden sm:block" />

            {/* Tangent Construction Lines */}
            <line
              x1="0"
              y1="320"
              x2="320"
              y2="320"
              strokeWidth="0.75"
              strokeDasharray="2 4"
              className="stroke-primary/30"
            />
            <circle cx="320" cy="320" r="3" className="fill-primary" />
            <circle cx="320" cy="320" r="8" className="stroke-primary/40" strokeWidth="0.75" />
          </svg>
        </div>

        {/* 3. MIDDLE-LEFT: TECHNICAL DOT MATRIX */}
        <div
          className={`absolute top-[38%] left-4 sm:left-12 hidden md:block ${
            enabled ? "transition-transform duration-200 ease-out" : ""
          }`}
          style={{
            transform: `translate3d(${-posX * 0.6 * invDist}px, ${-posY * 0.6 * invDist}px, 0)`,
          }}
        >
          <div className="grid grid-cols-4 gap-3">
            {Array.from({ length: 24 }).map((_, i) => {
              const isOrange = i === 5 || i === 14 || i === 19;
              return (
                <span
                  key={i}
                  className={`size-1.5 rounded-full transition-all duration-500 ${
                    isOrange
                      ? "bg-primary shadow-[0_0_8px_rgba(255,85,0,0.6)]"
                      : "bg-foreground/15 dark:bg-white/15"
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* 4. RIGHT SIDE: COMPOSITE 3D ARCHITECTURAL FORM */}
        <div
          className={`absolute top-[18%] md:top-[12%] right-[-10%] sm:right-[-4%] md:right-[2%] lg:right-[5%] w-[260px] sm:w-[420px] md:w-[500px] lg:w-[620px] h-[380px] sm:h-[550px] lg:h-[680px] origin-top-right scale-90 sm:scale-100 ${
            enabled ? "transition-transform duration-200 ease-out" : ""
          }`}
          style={{
            transform: `translate3d(${posX * 1.1 * invDist}px, ${posY * 1.1 * invDist}px, 0)`,
          }}
        >
          {/* Wireframe Construction Mesh Background */}
          {!isMobile && (
            <svg
              viewBox="0 0 600 680"
              className="absolute inset-0 size-full pointer-events-none fill-none"
            >
              <line
                x1="120"
                y1="220"
                x2="480"
                y2="70"
                stroke="currentColor"
                strokeWidth="0.8"
                className="text-foreground/15 dark:text-white/15"
              />
              <line
                x1="480"
                y1="70"
                x2="560"
                y2="280"
                stroke="currentColor"
                strokeWidth="0.8"
                className="text-foreground/15 dark:text-white/15"
              />
              <line
                x1="120"
                y1="220"
                x2="200"
                y2="420"
                stroke="currentColor"
                strokeWidth="0.8"
                className="text-foreground/15 dark:text-white/15"
              />
              <line
                x1="200"
                y1="420"
                x2="560"
                y2="280"
                stroke="currentColor"
                strokeWidth="0.8"
                className="text-foreground/15 dark:text-white/15"
              />

              <circle cx="480" cy="70" r="3.5" className="fill-primary" />
              <circle cx="120" cy="220" r="3" className="fill-primary" />
              <circle cx="200" cy="420" r="2.5" className="fill-foreground/40 dark:fill-white/40" />
              <circle cx="560" cy="280" r="3.5" className="fill-primary" />

              <path
                d="M 120 220 Q 320 20 480 70"
                stroke="currentColor"
                strokeWidth="1"
                strokeDasharray="3 4"
                className="text-primary/50"
              />
              <circle cx="280" cy="98" r="2.5" className="fill-primary" />

              <path
                d="M 580 80 H 590 M 585 75 V 85"
                stroke="currentColor"
                strokeWidth="1"
                className="text-foreground/30 dark:text-white/30"
              />
            </svg>
          )}

          {/* Backing Glass Frame Plane */}
          <div
            className={`absolute top-[50px] sm:top-[80px] left-[30px] sm:left-[60px] w-[180px] sm:w-[280px] lg:w-[380px] h-[220px] sm:h-[340px] lg:h-[440px] rounded-sm border border-foreground/10 dark:border-white/15 bg-white/30 dark:bg-white/5 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] ${
              enabled ? "transition-transform duration-300" : ""
            }`}
            style={{
              transform: `translate3d(${posX * 0.4 * invDist}px, ${posY * 0.4 * invDist}px, 0) rotate(1.5deg)`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-transparent dark:from-white/10 rounded-sm pointer-events-none" />
          </div>

          {/* VisezWorks Signature Translucent Orange Glass Slab */}
          <div
            className={`absolute top-[80px] sm:top-[130px] left-[90px] sm:left-[140px] lg:left-[170px] w-[100px] sm:w-[140px] lg:w-[190px] h-[180px] sm:h-[260px] lg:h-[340px] rounded-sm border border-orange-400/50 dark:border-orange-500/60 bg-gradient-to-tr from-primary/85 via-orange-500/70 to-amber-500/50 backdrop-blur-md shadow-[0_25px_60px_-15px_rgba(249,87,0,0.35)] dark:shadow-[0_25px_60px_-15px_rgba(249,87,0,0.5)] ${
              enabled ? "transition-transform duration-300" : ""
            }`}
            style={{
              transform: `translate3d(${posX * 0.8 * invDist}px, ${posY * 0.8 * invDist}px, 0) rotate(-1deg)`,
            }}
          >
            <div className="absolute top-0 right-0 h-full w-[2px] bg-gradient-to-b from-white/80 via-amber-200/50 to-transparent" />
            <div className="absolute top-0 left-0 w-full h-[2px] bg-white/60" />
          </div>

          {/* Concrete Architectural Wall Slice / Slab Behind */}
          {!isMobile && (
            <div
              className={`absolute top-[180px] right-[10px] w-[200px] sm:w-[280px] h-[300px] sm:h-[380px] rounded-sm bg-[#E3E2DC] dark:bg-[#23252A] border border-black/5 dark:border-white/10 shadow-2xl overflow-hidden ${
                enabled ? "transition-transform duration-300" : ""
              }`}
              style={{
                transform: `translate3d(${posX * 0.6 * invDist}px, ${posY * 0.6 * invDist}px, 0) rotate(-3deg)`,
              }}
            >
              <div className="h-1 w-full bg-white/70 dark:bg-white/10" />
              <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-black/10 dark:from-black/40 to-transparent pointer-events-none" />
            </div>
          )}
        </div>

        {/* 5. BOTTOM ARCHITECTURAL CONCRETE STEPS / PEDESTAL */}
        <div
          className={`absolute bottom-0 right-0 w-[280px] sm:w-[520px] lg:w-[820px] h-[120px] sm:h-[180px] lg:h-[260px] pointer-events-none ${
            enabled ? "transition-transform duration-200 ease-out" : ""
          }`}
          style={{
            transform: `translate3d(${posX * 0.5 * invDist}px, ${posY * 0.5 * invDist}px, 0)`,
          }}
        >
          <div className="relative size-full">
            <div className="absolute bottom-0 right-0 w-[90%] h-[80px] sm:h-[120px] lg:h-[180px] bg-[#E8E7E1] dark:bg-[#202125] border-t border-l border-white/80 dark:border-white/10 shadow-[0_-10px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_-10px_30px_rgba(0,0,0,0.3)]">
              <div className="absolute top-0 right-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white to-transparent" />
            </div>

            <div className="absolute bottom-0 right-[80px] sm:right-[180px] lg:right-[240px] w-[140px] sm:w-[220px] lg:w-[320px] h-[100px] sm:h-[160px] lg:h-[230px] bg-[#DDDCD5] dark:bg-[#27292E] border-t border-l border-white/90 dark:border-white/15 shadow-[-15px_0_30px_rgba(0,0,0,0.08)]">
              <div className="absolute top-0 inset-x-0 h-[2px] bg-white/80 dark:bg-white/20" />
            </div>

            {!isMobile && (
              <div className="absolute bottom-0 right-[320px] lg:right-[500px] w-[110px] lg:w-[160px] h-[80px] lg:h-[120px] bg-[#D4D3CC] dark:bg-[#1C1D21] border-t border-l border-white/70 dark:border-white/10 shadow-lg" />
            )}
          </div>
        </div>

        {/* 6. CORNER & EDGE FINE TECHNICAL DETAILS */}
        <div className="absolute top-8 right-8 font-mono text-xs text-foreground/20 dark:text-white/20 select-none">
          +
        </div>
      </div>
    </div>
  );
}

/** Alias re-export for backwards compatibility */
export const ArchitecturalBackground = BackgroundAtmosphere;
