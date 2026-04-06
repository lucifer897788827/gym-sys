"use client";

import { Suspense, useState, useEffect } from "react";
import dynamic from "next/dynamic";

const Scene = dynamic(() => import("./gym-scene-canvas"), {
  ssr: false,
  loading: () => null,
});

export function GymScene({ className = "" }: { className?: string }) {
  const [isMobile, setIsMobile] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const setupState = () => {
      setIsMobile(window.innerWidth < 1024);
      setPrefersReducedMotion(
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      );
    };
    setupState();

    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isMobile || prefersReducedMotion) return null;

  return (
    <div className={`${className}`} style={{ pointerEvents: "none" }}>
      <Suspense
        fallback={
          <div className="flex h-full items-center justify-center">
            <div
              className="h-12 w-12 rounded-full animate-pulse"
              style={{ background: "var(--accent-electric-glow)" }}
            />
          </div>
        }
      >
        <Scene />
      </Suspense>
    </div>
  );
}
