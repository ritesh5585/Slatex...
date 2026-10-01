"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface CtaBannerProps {
  onAnalyzeProfile: () => void;
}

export function CtaBanner({ onAnalyzeProfile }: CtaBannerProps) {
  const bannerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }

    const ctx = gsap.context(() => {
      if (bannerRef.current) {
        gsap.fromTo(
          bannerRef.current,
          { scale: 0.94, opacity: 0.3, y: 25 },
          {
            scale: 1,
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: bannerRef.current,
              start: "top 90%",
              end: "bottom 10%",
              toggleActions: "play reverse play reverse",
            },
          }
        );
      }
    }, bannerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div
        ref={bannerRef}
        className="relative w-full rounded-2xl sm:rounded-3xl bg-[#685cf6] py-14 sm:py-16 px-6 sm:px-12 flex flex-col items-center justify-center text-center shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-indigo-600/30"
      >
        {/* Subtle decorative glow */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-white/15 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-black/20 rounded-full blur-2xl pointer-events-none" />

        {/* Heading */}
        <h3 className="relative z-10 text-2xl sm:text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
          See your own GitHub story
        </h3>

        {/* Action Button */}
        <button
          ref={buttonRef}
          type="button"
          onClick={onAnalyzeProfile}
          className="relative z-10 mt-6 sm:mt-8 px-7 py-3 rounded-full bg-white text-zinc-950 font-bold text-sm sm:text-base hover:bg-zinc-100 hover:shadow-xl hover:shadow-black/20 active:scale-95 transition-all duration-200 cursor-pointer shadow-md"
        >
          Analyze my profile
        </button>
      </div>
    </section>
  );
}
