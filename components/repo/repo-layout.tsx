"use client";

import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RepoSidebar } from "./repo-sidebar";
import { RepoPageHeader } from "./repo-page-header";

gsap.registerPlugin(ScrollTrigger);

interface RepoLayoutProps {
  owner: string;
  repoName: string;
  repoUrl: string;
  homepage?: string | null;
  description?: string | null;
  license?: string | null;
  createdAt?: string | null;
  pushedAt?: string | null;
  defaultBranch?: string | null;
  children: React.ReactNode;
  sections: { id: string; ref: React.RefObject<HTMLElement | null> }[];
}

export function RepoLayout({
  owner,
  repoName,
  repoUrl,
  homepage,
  description,
  license,
  createdAt,
  pushedAt,
  defaultBranch,
  children,
  sections,
}: RepoLayoutProps) {
  const [activeSection, setActiveSection] = useState("overview");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll to section on sidebar click
  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);
    const target = sections.find((s) => s.id === sectionId);
    if (target?.ref.current) {
      target.ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Observe scroll to update active section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { threshold: 0.3, rootMargin: "-80px 0px -60% 0px" }
    );
    sections.forEach((s) => {
      if (s.ref.current) observer.observe(s.ref.current);
    });
    return () => observer.disconnect();
  }, [sections]);

  // GSAP entrance animation
  useEffect(() => {
    if (!scrollRef.current) return;
    const cards = scrollRef.current.querySelectorAll(".repo-card-anim");
    gsap.fromTo(
      cards,
      { opacity: 0, y: 28 },
      {
        opacity: 1,
        y: 0,
        duration: 0.55,
        stagger: 0.08,
        ease: "power3.out",
        clearProps: "all",
      }
    );
  }, []);

  return (
    <main className="h-screen bg-[#08090f] text-zinc-100 antialiased flex overflow-hidden">
      {/* Sidebar */}
      <div className="hidden md:flex w-52 shrink-0 flex-col h-full">
        <RepoSidebar
          owner={owner}
          repoName={repoName}
          repoUrl={repoUrl}
          homepage={homepage}
          description={description}
          license={license}
          createdAt={createdAt}
          pushedAt={pushedAt}
          defaultBranch={defaultBranch}
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
        />
      </div>

      {/* Main */}
      <div className="relative flex-1 flex flex-col min-w-0 overflow-hidden bg-[#08090f]">
        {/* Glow effects */}
        <div className="hero-glow" />
        <div className="hero-grid absolute inset-0 opacity-[0.06] pointer-events-none" />
        <div className="repo-glow-purple" />

        <RepoPageHeader
          owner={owner}
          repoName={repoName}
          repoUrl={repoUrl}
          homepage={homepage}
          description={description}
          license={license}
          createdAt={createdAt}
          pushedAt={pushedAt}
          defaultBranch={defaultBranch}
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
        />

        {/* Scrollable content */}
        <div ref={scrollRef} className="relative z-10 flex-1 overflow-y-auto scroll-smooth">
          {children}
        </div>
      </div>
    </main>
  );
}
