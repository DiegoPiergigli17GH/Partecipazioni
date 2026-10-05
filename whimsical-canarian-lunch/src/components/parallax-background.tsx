"use client"

import { useEffect } from "react"

export function ParallaxBackground() {
  useEffect(() => {
    const root = document.documentElement

    const update = () => {
      const max = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight,
      )
      const p = Math.min(1, Math.max(0, window.scrollY / max))
      root.style.setProperty("--scroll-p", p.toFixed(4))
    }

    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    return () => {
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [])

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/whimsical-canarian-lunch.jpg"
        alt=""
        className="parallax-art"
      />
      <div className="absolute inset-0 bg-black/5" />
    </div>
  )
}
