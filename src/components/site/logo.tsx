import React from "react";

interface LogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  className?: string;
  variant?: "auto" | "light" | "dark";
}

/**
 * Clean Icon Mark for VisezWorks (Orange Chevron + Stylized W).
 * Uses icon-only transparent PNG versions for badges, hero emblem, and tight spaces.
 */
export function VisezWorksIcon({ className = "h-10 w-auto", variant = "auto", ...props }: LogoProps) {
  const isDark = variant === "dark";
  const isLight = variant === "light";

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
      {isLight ? (
        <img
          src="/visezworks-icon-transparent.png"
          alt="VisezWorks Icon"
          className="h-full w-auto object-contain transition-all duration-300 drop-shadow-sm"
          {...props}
        />
      ) : isDark ? (
        <img
          src="/visezworks-icon-dark.png"
          alt="VisezWorks Icon"
          className="h-full w-auto object-contain transition-all duration-300 drop-shadow-[0_4px_20px_rgba(255,85,0,0.25)]"
          {...props}
        />
      ) : (
        <>
          <img
            src="/visezworks-icon-transparent.png"
            alt="VisezWorks Icon"
            className="block dark:hidden h-full w-auto object-contain transition-all duration-300 drop-shadow-sm"
            {...props}
          />
          <img
            src="/visezworks-icon-dark.png"
            alt="VisezWorks Icon Dark"
            className="hidden dark:block h-full w-auto object-contain transition-all duration-300 drop-shadow-[0_4px_20px_rgba(255,85,0,0.25)]"
            {...props}
          />
        </>
      )}
    </div>
  );
}

/**
 * Full VisezWorks Logo with Icon & VISEZWORKS Typography (Tagline Removed for Ultra-Premium feel).
 */
export function VisezWorksFullLogo({
  className = "h-16 w-auto",
  variant = "auto",
  ...props
}: LogoProps) {
  const isDark = variant === "dark";
  const isLight = variant === "light";

  return (
    <div className={`relative inline-flex items-center shrink-0 ${className}`}>
      {isLight ? (
        <img
          src="/visezworks-logo-transparent.png"
          alt="VisezWorks Logo"
          className="h-full w-auto object-contain transition-all duration-300"
          {...props}
        />
      ) : isDark ? (
        <img
          src="/visezworks-logo-dark.png"
          alt="VisezWorks Logo"
          className="h-full w-auto object-contain transition-all duration-300 drop-shadow-[0_4px_24px_rgba(255,85,0,0.2)]"
          {...props}
        />
      ) : (
        <>
          <img
            src="/visezworks-logo-transparent.png"
            alt="VisezWorks Logo"
            className="block dark:hidden h-full w-auto object-contain transition-all duration-300"
            {...props}
          />
          <img
            src="/visezworks-logo-dark.png"
            alt="VisezWorks Logo Dark"
            className="hidden dark:block h-full w-auto object-contain transition-all duration-300 drop-shadow-[0_4px_24px_rgba(255,85,0,0.2)]"
            {...props}
          />
        </>
      )}
    </div>
  );
}

/**
 * Responsive Logo image component with prominent sizing and seamless background integration.
 */
export function VisezWorksResponsiveLogo({ className = "h-14 sm:h-16 w-auto" }: { className?: string }) {
  return (
    <div className={`relative flex items-center shrink-0 ${className}`}>
      <img
        src="/visezworks-logo-transparent.png"
        alt="VisezWorks Logo Light"
        className="block dark:hidden h-full w-auto object-contain transition-all duration-300 hover:scale-105"
      />
      <img
        src="/visezworks-logo-dark.png"
        alt="VisezWorks Logo Dark"
        className="hidden dark:block h-full w-auto object-contain transition-all duration-300 drop-shadow-[0_4px_24px_rgba(255,85,0,0.25)] hover:scale-105"
      />
    </div>
  );
}


