"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function StatsBanner() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const num1Ref = useRef<HTMLSpanElement>(null);
  const num2Ref = useRef<HTMLSpanElement>(null);
  const num3Ref = useRef<HTMLSpanElement>(null);
  const num4Ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }

    const ctx = gsap.context(() => {
      // Counter animation triggered on scroll AND reverse scroll
      const stats = [
        { ref: num1Ref, target: 10, suffix: "M+" },
        { ref: num2Ref, target: 2, suffix: "M+" },
        { ref: num3Ref, target: 50, suffix: "K+" },
        { ref: num4Ref, target: 100, suffix: "K+" },
      ];

      if (cardRef.current) {
        gsap.fromTo(
          cardRef.current,
          { opacity: 0.25, y: 30, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: cardRef.current,
              start: "top 90%",
              end: "bottom 10%",
              toggleActions: "play reverse play reverse",
              onEnter: () => animateNumbers(),
              onEnterBack: () => animateNumbers(),
            },
          }
        );
      }

      function animateNumbers() {
        stats.forEach((stat) => {
          if (!stat.ref.current) return;
          const obj = { val: 0 };
          gsap.to(obj, {
            val: stat.target,
            duration: 1.5,
            ease: "power2.out",
            onUpdate: () => {
              if (stat.ref.current) {
                stat.ref.current.innerText = `${Math.floor(obj.val)}${stat.suffix}`;
              }
            },
          });
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10"
    >
      <div
        ref={cardRef}
        className="w-full rounded-2xl border border-zinc-700/80 bg-[#0e111c] p-6 sm:p-8 md:p-10 backdrop-blur-xl shadow-2xl transition-all duration-300 hover:border-indigo-500/40"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {/* Stat 1 */}
          <div className="space-y-1">
            <h4 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              <span ref={num1Ref}>10M+</span>
            </h4>
            <p className="text-xs sm:text-sm text-zinc-300 font-medium">
              Profiles analyzed
            </p>
          </div>

          {/* Stat 2 */}
          <div className="space-y-1">
            <h4 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              <span ref={num2Ref}>2M+</span>
            </h4>
            <p className="text-xs sm:text-sm text-zinc-300 font-medium">
              Repositories indexed
            </p>
          </div>

          {/* Stat 3 */}
          <div className="space-y-1">
            <h4 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              <span ref={num3Ref}>50K+</span>
            </h4>
            <p className="text-xs sm:text-sm text-zinc-300 font-medium">
              Active users
            </p>
          </div>

          {/* Stat 4 */}
          <div className="space-y-1">
            <h4 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              <span ref={num4Ref}>100K+</span>
            </h4>
            <p className="text-xs sm:text-sm text-zinc-300 font-medium">
              Insights generated
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
