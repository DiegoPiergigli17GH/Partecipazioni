"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "pranzo-scroll-intro";
const HOLD_MS = 1600;
const OPEN_MS = 2200;

type Phase = "closed" | "opening" | "done";

function ScrollRod() {
  return (
    <div className="scroll-rod" aria-hidden="true">
      <span className="scroll-knob" />
      <span className="scroll-knob scroll-knob-end" />
    </div>
  );
}

export function ScrollIntro() {
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>("closed");

  const finish = useCallback(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* private mode */
    }
    document.documentElement.classList.add("scroll-intro-seen");
    document.documentElement.classList.remove("scroll-intro-active");
    setPhase("done");
  }, []);

  const open = useCallback(() => {
    setPhase((current) => (current === "closed" ? "opening" : current));
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
      finish();
      return;
    }

    document.documentElement.classList.add("scroll-intro-active");
    const openAt = window.setTimeout(() => setPhase("opening"), HOLD_MS);
    return () => window.clearTimeout(openAt);
  }, [finish, pathname]);

  useEffect(() => {
    if (phase !== "opening") return;
    const doneAt = window.setTimeout(finish, OPEN_MS);
    return () => window.clearTimeout(doneAt);
  }, [finish, phase]);

  if (pathname !== "/" || phase === "done") return null;

  return (
    <div
      className={`scroll-intro is-${phase}`}
      role="dialog"
      aria-label="I CAST END OF SUMMER BANQUET"
      aria-modal="true"
      onClick={() => {
        if (phase === "closed") open();
        else finish();
      }}
    >
      <div className="scroll-half scroll-half-top">
        <div className="scroll-half-sheet" />
        <ScrollRod />
      </div>

      <div className="scroll-title-wrap">
        <p className="scroll-title">
          I CAST
          <br />
          END OF SUMMER
          <br />
          BANQUET
        </p>
      </div>

      <div className="scroll-half scroll-half-bottom">
        <ScrollRod />
        <div className="scroll-half-sheet" />
      </div>
    </div>
  );
}
