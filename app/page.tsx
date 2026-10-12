"use client";

import React, { useRef, useState } from "react";
import {
  Navbar,
  Hero,
  Showcase,
  Features,
  Capabilities,
  HowItWorks,
  Faq,
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

  const handleFocusSearch = () => {
    if (searchInputRef.current) {
      searchInputRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 250);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSelectUser = (username: string) => {
    if (searchInputRef.current) {
      searchInputRef.current.value = username;
      const event = new Event("input", { bubbles: true });
      searchInputRef.current.dispatchEvent(event);
      handleFocusSearch();
    }
  };

  return (
    <main className="relative min-h-screen bg-[#08090f] text-zinc-100 flex flex-col justify-between overflow-x-hidden selection:bg-indigo-500/30 selection:text-indigo-200 pt-14">
      {/* Fixed top navbar with Get started button */}
      <Navbar onGetStarted={handleFocusSearch} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center w-full">
        {/* Search Hero */}
        <Hero searchInputRef={searchInputRef} />

        {/* Live Interactive Preview */}
        <div id="showcase" className="w-full">
          <Showcase onSelectUser={handleSelectUser} />
        </div>

        {/* 4 Core Platform Tools */}
        <Features
          onExploreClick={handleFocusSearch}
          onCompareClick={() => setIsCompareOpen(true)}
          onOpenSourceClick={() => setIsOpenSourceOpen(true)}
          onYouTubeClick={() => setIsYouTubeOpen(true)}
        />

        {/* 3-Step Workflow */}
        <HowItWorks />

        {/* Core Capabilities */}
        <Capabilities />

        {/* FAQ Accordion */}
        <Faq />

        {/* CTA Banner */}
        <CtaBanner onAnalyzeProfile={() => setIsProfilePromptOpen(true)} />
      </div>

      {/* Footer */}
      <Footer />

      {/* Feature Modals */}
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
