import React from "react";

/**
 * Smooth letter-rolling text component for navbar links.
 * Scrolls each character smoothly from black/foreground to orange on hover.
 */
export function ScrambleText({
  text,
  active,
  className = "",
}: {
  text: string;
  active: boolean;
  className?: string;
  speed?: number;
}) {
  return (
    <span
      className={`relative inline-flex items-center overflow-hidden leading-none select-none ${className}`}
    >
      {text.split("").map((char, i) => {
        const isSpace = char === " ";
        return (
          <span
            key={i}
            className="relative inline-block overflow-hidden py-0.5 leading-none"
          >
            {/* Top letter: Default foreground color */}
            <span
              className={`inline-block transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                active ? "-translate-y-[135%]" : "translate-y-0"
              }`}
              style={{ transitionDelay: `${i * 25}ms` }}
            >
              {isSpace ? "\u00A0" : char}
            </span>

            {/* Bottom letter: Orange primary color */}
            <span
              className={`absolute left-0 top-0 inline-block py-0.5 font-semibold text-primary transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                active ? "translate-y-0" : "translate-y-[135%]"
              }`}
              style={{ transitionDelay: `${i * 25}ms` }}
            >
              {isSpace ? "\u00A0" : char}
            </span>
          </span>
        );
      })}
    </span>
  );
}

