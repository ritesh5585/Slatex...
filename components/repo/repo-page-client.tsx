"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RepoSidebar } from "./repo-sidebar";
import { RepoPageHeader } from "./repo-page-header";
import { useState } from "react";

gsap.registerPlugin(ScrollTrigger);

interface RepoPageClientProps {
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
}

export function RepoPageClient({
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
}: RepoPageClientProps) {
  const [activeSection, setActiveSection] = useState("overview");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);
    const el = scrollContainerRef.current?.querySelector(`#repo-section-${sectionId}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const sectionIds = ["overview", "activity", "commits", "people", "releases", "readme"];
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = container.querySelector(`#repo-section-${id}`);
      if (!el) return;
      const obs = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) setActiveSection(id);
          }
        },
        { root: container, threshold: 0.25, rootMargin: "-64px 0px -55% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  // GSAP entrance animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".repo-card-anim",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.07,
          ease: "power3.out",
          delay: 0.1,
        }
      );
    }, scrollContainerRef);
    return () => ctx.revert();
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

      {/* Main content */}
      <div className="relative flex-1 flex flex-col min-w-0 overflow-hidden bg-[#08090f] selection:bg-indigo-500/30 selection:text-indigo-200">
        {/* Background glows */}
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

        {/* Scrollable */}
        <div
          ref={scrollContainerRef}
          className="relative z-10 flex-1 overflow-y-auto scroll-smooth"
        >
          {children}
        </div>
      </div>
    </main>
  );
}
