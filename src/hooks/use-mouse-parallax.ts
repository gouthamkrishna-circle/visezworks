import { useEffect, useRef, useState } from "react";

interface ParallaxOptions {
  /** Lerp factor for smooth dampening (0.01 - 0.1) */
  damping?: number;
  /** Max pixel offset for parallax movements */
  maxOffset?: number;
}

interface ParallaxOffset {
  x: number;
  y: number;
  /** Inverse distance factor relative to screen center (0 to 1) */
  inverseDistance: number;
}

/**
 * Custom hook tracking mouse position relative to window center.
 * Uses requestAnimationFrame for 60fps performance.
 * Calculates inverse distance scale from center and respects prefers-reduced-motion & mobile media queries.
 */
export function useMouseParallax(options: ParallaxOptions = {}) {
  const { damping = 0.05, maxOffset = 30 } = options;

  const targetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const currentRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const animFrameRef = useRef<number | null>(null);

  const [offset, setOffset] = useState<ParallaxOffset>({
    x: 0,
    y: 0,
    inverseDistance: 1,
  });

  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check reduced motion
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(motionQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
    };
    motionQuery.addEventListener("change", handleMotionChange);

    // Check mobile screen
    const mobileQuery = window.matchMedia("(max-width: 767px)");
    setIsMobile(mobileQuery.matches);

    const handleMobileChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };
    mobileQuery.addEventListener("change", handleMobileChange);

    if (motionQuery.matches || mobileQuery.matches) {
      return () => {
        motionQuery.removeEventListener("change", handleMotionChange);
        mobileQuery.removeEventListener("change", handleMobileChange);
      };
    }

    const handlePointerMove = (e: PointerEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      // Normalized coordinates from center (-1 to 1)
      const normX = (e.clientX - centerX) / centerX;
      const normY = (e.clientY - centerY) / centerY;

      targetRef.current = { x: normX, y: normY };
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    // 60FPS update loop (only re-renders React state when coordinates are moving)
    const updateLoop = () => {
      const target = targetRef.current;
      const current = currentRef.current;

      const dx = target.x - current.x;
      const dy = target.y - current.y;

      if (Math.abs(dx) > 0.0001 || Math.abs(dy) > 0.0001) {
        // Smooth dampening
        current.x += dx * damping;
        current.y += dy * damping;

        // Calculate distance from center
        const distFromCenter = Math.sqrt(current.x * current.x + current.y * current.y);
        const invDist = 1 / (1 + distFromCenter * 1.2);

        setOffset({
          x: current.x * maxOffset,
          y: current.y * maxOffset,
          inverseDistance: invDist,
        });
      }

      animFrameRef.current = requestAnimationFrame(updateLoop);
    };

    animFrameRef.current = requestAnimationFrame(updateLoop);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      motionQuery.removeEventListener("change", handleMotionChange);
      mobileQuery.removeEventListener("change", handleMobileChange);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [damping, maxOffset]);

  return {
    x: isReducedMotion || isMobile ? 0 : offset.x,
    y: isReducedMotion || isMobile ? 0 : offset.y,
    inverseDistance: isReducedMotion || isMobile ? 1 : offset.inverseDistance,
    isReducedMotion,
    isMobile,
  };
}
