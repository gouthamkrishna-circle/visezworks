"use client";
import React from "react";
import type { ComponentProps, ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { FacebookIcon, InstagramIcon, LinkedinIcon, YoutubeIcon } from "lucide-react";
import { VisezWorksResponsiveLogo } from "@/components/site/logo";

interface FooterLink {
  title: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface FooterSection {
  label: string;
  links: FooterLink[];
}

const footerLinks: FooterSection[] = [
  {
    label: "Navigation",
    links: [
      { title: "Featured Works", href: "#works" },
      { title: "About Studio", href: "#about" },
      { title: "Project Roadmap", href: "#roadmap" },
      { title: "Get In Touch", href: "#contact" },
    ],
  },
  {
    label: "Services",
    links: [
      { title: "Web Development", href: "#works" },
      { title: "Video Editing", href: "#works" },
      { title: "Digital Design", href: "#works" },
      { title: "Motion & VFX", href: "#works" },
    ],
  },
  {
    label: "Studio",
    links: [
      { title: "Case Studies", href: "#works" },
      { title: "Client Reviews", href: "#about" },
      { title: "Process", href: "#roadmap" },
      { title: "Contact Us", href: "#contact" },
    ],
  },
  {
    label: "Social Links",
    links: [
      { title: "Facebook", href: "https://facebook.com", icon: FacebookIcon },
      { title: "Instagram", href: "https://instagram.com", icon: InstagramIcon },
      { title: "Youtube", href: "https://youtube.com", icon: YoutubeIcon },
      { title: "LinkedIn", href: "https://linkedin.com", icon: LinkedinIcon },
    ],
  },
];

export function Footer() {
  return (
    <footer className="md:rounded-t-6xl relative w-full max-w-6xl mx-auto flex flex-col items-center justify-center rounded-t-4xl border-t border-border bg-[radial-gradient(35%_128px_at_50%_0%,color-mix(in_oklch,var(--foreground)_8%,transparent),transparent)] px-6 py-12 lg:py-16 mt-12">
      <div className="bg-foreground/20 absolute top-0 right-1/2 left-1/2 h-px w-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full blur" />

      <div className="grid w-full gap-8 xl:grid-cols-3 xl:gap-8">
        <AnimatedContainer className="space-y-4">
          <div className="flex items-center gap-2">
            <VisezWorksResponsiveLogo className="h-16 sm:h-20 w-auto" />
          </div>
          <p className="text-muted-foreground mt-4 text-sm max-w-xs">
            High-impact web development and professional video editing studio crafting memorable
            digital experiences.
          </p>
          <p className="text-muted-foreground font-bebas text-sm tracking-wider pt-2">
            © {new Date().getFullYear()} VisezWorks. All rights reserved.
          </p>
        </AnimatedContainer>

        <div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-4 xl:col-span-2 xl:mt-0">
          {footerLinks.map((section, index) => (
            <AnimatedContainer key={section.label} delay={0.1 + index * 0.1}>
              <div className="mb-10 md:mb-0">
                <h3 className="font-bebas text-base uppercase tracking-wider text-foreground">
                  {section.label}
                </h3>
                <ul className="text-muted-foreground mt-4 space-y-2 text-sm">
                  {section.links.map((link) => (
                    <li key={link.title}>
                      <a
                        href={link.href}
                        className="hover:text-primary inline-flex items-center transition-all duration-300"
                      >
                        {link.icon && <link.icon className="me-1.5 size-4 text-primary" />}
                        {link.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedContainer>
          ))}
        </div>
      </div>
    </footer>
  );
}

type ViewAnimationProps = {
  delay?: number;
  className?: ComponentProps<typeof motion.div>["className"];
  children: ReactNode;
};

function AnimatedContainer({ className, delay = 0.1, children }: ViewAnimationProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return children;
  }

  return (
    <motion.div
      initial={{ filter: "blur(4px)", translateY: -8, opacity: 0 }}
      whileInView={{ filter: "blur(0px)", translateY: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.8 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
