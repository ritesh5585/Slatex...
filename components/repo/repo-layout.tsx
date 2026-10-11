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
  sections?: { id: string; ref: React.RefObject<HTMLElement | null> }[];
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

  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);

    if (sections) {
      const target = sections.find((s) => s.id === sectionId);
      if (target?.ref.current) {
        target.ref.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        return;
      }
    }

    const el = scrollRef.current?.querySelector(`#repo-section-${sectionId}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const targetIds = sections
      ? sections.map((s) => s.id)
      : ["overview", "activity", "commits", "people", "releases", "readme"];

    const observers: IntersectionObserver[] = [];

    targetIds.forEach((id) => {
      let el: Element | null | undefined = null;
      if (sections) {
        el = sections.find((s) => s.id === id)?.ref.current;
      }
      if (!el) {
        el = container.querySelector(`#repo-section-${id}`);
      }

      if (!el) return;

      const obs = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) setActiveSection(id);
          }
        },
        { root: container, threshold: 0.25, rootMargin: "-64px 0px -55% 0px" },
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [sections]);

  // GSAP Entrance Animation
  useEffect(() => {
    if (!scrollRef.current) return;
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
        },
      );
    }, scrollRef);
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

      {/* Main */}
      <div className="relative flex-1 flex flex-col min-w-0 overflow-hidden bg-[#08090f] selection:bg-indigo-500/30 selection:text-indigo-200">
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
        <div
          ref={scrollRef}
          className="relative z-10 flex-1 overflow-y-auto scroll-smooth"
        >
          {children}
        </div>
      </div>
    </main>
  );
}
