"use client";

import React, { useRef, useState } from "react";
import {
  Navbar,
  Hero,
  Features,
  StatsBanner,
  CtaBanner,
  Footer,
  CompareModal,
  YouTubeModal,
  OpenSourceModal,
  ProfilePromptModal,
} from "@/components/landing";

export default function Home() {
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Modals state
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isYouTubeOpen, setIsYouTubeOpen] = useState(false);
  const [isOpenSourceOpen, setIsOpenSourceOpen] = useState(false);
  const [isProfilePromptOpen, setIsProfilePromptOpen] = useState(false);

  // Focus search input on Get Started or Explore click
  const handleFocusSearch = () => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
      searchInputRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  return (
    <main className="relative min-h-screen bg-[#08090f] text-zinc-100 flex flex-col justify-between overflow-x-hidden selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Background ambient lighting */}
      <div className="hero-glow" />
      <div className="hero-grid absolute inset-0 opacity-[0.06] pointer-events-none" />

      {/* Top Navbar: only Get Started button as instructed */}
      <Navbar onGetStarted={handleFocusSearch} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center w-full z-10">
        {/* Hero Section */}
        <Hero searchInputRef={searchInputRef} />

        {/* Feature Cards Section: Everything starts with a username */}
        <Features
          onExploreClick={handleFocusSearch}
          onCompareClick={() => setIsCompareOpen(true)}
          onOpenSourceClick={() => setIsOpenSourceOpen(true)}
          onYouTubeClick={() => setIsYouTubeOpen(true)}
        />

        {/* Stats Metrics Banner: 10M+, 2M+, 50K+, 100K+ */}
        <StatsBanner />

        {/* Purple CTA Banner: See your own GitHub story */}
        <CtaBanner onAnalyzeProfile={() => setIsProfilePromptOpen(true)} />
      </div>

      {/* Footer */}
      <Footer />

      {/* Interactive Feature Modals */}
      <CompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
      />
      <OpenSourceModal
        isOpen={isOpenSourceOpen}
        onClose={() => setIsOpenSourceOpen(false)}
      />
      <YouTubeModal
        isOpen={isYouTubeOpen}
        onClose={() => setIsYouTubeOpen(false)}
      />
      <ProfilePromptModal
        isOpen={isProfilePromptOpen}
        onClose={() => setIsProfilePromptOpen(false)}
      />
    </main>
  );
}
