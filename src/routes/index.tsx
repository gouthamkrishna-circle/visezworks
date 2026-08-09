import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { Navbar } from "@/components/site/navbar";
import { Hero } from "@/components/site/hero";
import { About } from "@/components/site/about";
import { Works } from "@/components/site/works";
import { Contact } from "@/components/site/contact";
import { Footer } from "@/components/ui/footer-section";
import { ChatBubble } from "@/components/site/chat-bubble";
import { AdminPanel } from "@/components/site/admin-panel";
import { ArchitecturalBackground } from "@/components/site/architectural-background";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VisezWorks — Web Development & Video Editing Studio" },
      {
        name: "description",
        content:
          "VisezWorks is a small creative digital agency building fast, modern websites and engaging video content for brands, creators, and businesses.",
      },
      { property: "og:title", content: "VisezWorks — Web Development & Video Editing Studio" },
      {
        property: "og:description",
        content: "Fast, modern websites and engaging video edits. Vision • Innovate • Create.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

function Index() {
  useEffect(() => {
    // Ensure the website starts at the hero page on load
    if (typeof window !== "undefined") {
      if (window.location.hash === "#about" || !window.location.hash) {
        window.scrollTo(0, 0);
        if (window.location.hash === "#about") {
          history.replaceState(null, "", window.location.pathname + window.location.search);
        }
      }
    }
  }, []);

  return (
    <div className="relative min-h-screen text-foreground selection:bg-primary selection:text-primary-foreground">
      <ArchitecturalBackground />
      <div className="relative z-10">
        <Navbar />
        <main>
          <Hero />
          <About />
          <Works />
          <Contact />
        </main>
        <Footer />
        <ChatBubble />
        <AdminPanel />
      </div>
    </div>
  );
}
