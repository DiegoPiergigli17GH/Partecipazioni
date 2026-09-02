"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "pranzo-scroll-intro";
const PLAY_MS = 3200;
const FADE_MS = 900;

type Phase = "play" | "fade" | "done";

export function ScrollIntro() {
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>("play");

  const dismiss = useCallback((immediate = false) => {
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* private mode */
    }
    document.documentElement.classList.add("scroll-intro-seen");
    document.documentElement.classList.remove("scroll-intro-active");

    if (immediate) {
      setPhase("done");
      return;
    }
    setPhase("fade");
  }, []);

  useEffect(() => {
    if (pathname !== "/") {
      document.documentElement.classList.remove("scroll-intro-active");
      return;
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let seen = false;
    try {
      seen = sessionStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      seen = false;
    }

    if (reduced || seen) {
      dismiss(true);
      return;
    }

    document.documentElement.classList.add("scroll-intro-active");

    const fadeAt = window.setTimeout(() => dismiss(false), PLAY_MS);
    return () => window.clearTimeout(fadeAt);
  }, [dismiss, pathname]);

  useEffect(() => {
    if (phase !== "fade") return;
    const doneAt = window.setTimeout(() => setPhase("done"), FADE_MS);
    return () => window.clearTimeout(doneAt);
  }, [phase]);

  if (pathname !== "/" || phase === "done") return null;

  return (
    <div
      className={`scroll-intro${phase === "fade" ? " is-fading" : ""}`}
      role="dialog"
      aria-label="I CAST END OF SUMMER BANQUET"
      aria-modal="true"
      onClick={() => dismiss(false)}
    >
      <div className="scroll-intro-glow" aria-hidden="true" />
      <div className="scroll-stage">
        <div className="scroll-rod scroll-rod-top" aria-hidden="true">
          <span className="scroll-knob" />
          <span className="scroll-knob scroll-knob-end" />
        </div>

        <div className="scroll-sheet">
          <div className="scroll-sheet-inner">
            <p className="scroll-title">
              I CAST
              <br />
              END OF SUMMER
              <br />
              BANQUET
            </p>
          </div>
        </div>

        <div className="scroll-rod scroll-rod-bottom" aria-hidden="true">
          <span className="scroll-knob" />
          <span className="scroll-knob scroll-knob-end" />
        </div>

        <div className="scroll-seal" aria-hidden="true">
          <svg viewBox="0 0 72 72" className="scroll-seal-svg">
            <defs>
              <radialGradient id="scrollSealFill" cx="35%" cy="30%" r="75%">
                <stop offset="0%" stopColor="#d45a4a" />
                <stop offset="55%" stopColor="#a32822" />
                <stop offset="100%" stopColor="#6e1210" />
              </radialGradient>
            </defs>
            <circle cx="36" cy="36" r="34" fill="url(#scrollSealFill)" />
            <circle
              cx="36"
              cy="36"
              r="26"
              fill="none"
              stroke="#f3d2a6"
              strokeWidth="1.4"
              opacity="0.55"
            />
            <path
              d="M36 18.5l3.4 10.4h10.9l-8.8 6.4 3.4 10.4L36 39.3l-8.9 6.4 3.4-10.4-8.8-6.4h10.9z"
              fill="#f6e2c0"
              opacity="0.9"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
