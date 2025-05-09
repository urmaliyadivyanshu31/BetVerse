"use client"

import type React from "react"

import { useEffect, useRef } from "react"

interface AnimatedBackgroundProps {
  children: React.ReactNode
  variant?: "dots" | "grid"
  className?: string
}

export default function AnimatedBackground({ children, variant = "dots", className = "" }: AnimatedBackgroundProps) {
  const backgroundRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (backgroundRef.current) {
        const scrollY = window.scrollY
        const opacity = Math.max(0.05, 0.2 - scrollY * 0.0005)
        backgroundRef.current.style.opacity = opacity.toString()
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className={`relative ${className}`}>
      <div
        ref={backgroundRef}
        className={`absolute inset-0 transition-opacity duration-500 ${
          variant === "dots" ? "dot-grid" : "grid-pattern"
        }`}
        style={{ opacity: 0.2 }}
      ></div>
      {children}
    </div>
  )
}
