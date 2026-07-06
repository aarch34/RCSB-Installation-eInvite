"use client";

import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";

interface BackgroundGlowProps {
  isButtonHovered?: boolean;
}

export default function BackgroundGlow({ isButtonHovered = false }: BackgroundGlowProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Generate stable particles configuration (stars, diamonds, circles, specks)
  const particles = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => {
      const type = i % 4 === 0 ? "star" : i % 4 === 1 ? "diamond" : i % 4 === 2 ? "circle" : "speck";
      return {
        id: i,
        type,
        // Make stars and diamonds slightly larger so their shape is legible
        size: type === "star" || type === "diamond" ? Math.random() * 3.5 + 2.5 : Math.random() * 1.6 + 0.8,
        xStart: Math.random() * 100,
        yStart: Math.random() * 100,
        xDrift: (Math.random() - 0.5) * 25, // slow drift
        yDrift: (Math.random() - 0.5) * 25,
        duration: 16 + Math.random() * 14, // slow motion
        delay: i * 0.35,
        color: i % 3 === 0 ? "rgba(165, 188, 214, 0.15)" : i % 3 === 1 ? "rgba(245, 239, 200, 0.20)" : "rgba(77, 14, 18, 0.10)", // Blue, Yellow, Red
      };
    });
  }, []);

  const renderParticleContent = (type: string) => {
    switch (type) {
      case "star":
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
            <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" />
          </svg>
        );
      case "diamond":
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
            <polygon points="12,2 18,12 12,22 6,12" />
          </svg>
        );
      case "circle":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
            <circle cx="12" cy="12" r="8" />
          </svg>
        );
      default:
        return <div className="w-[85%] h-[85%] rounded-full bg-current opacity-80" />;
    }
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-[#231815]" aria-hidden="true">
      {/* 1. Edge Vignette (Darkens corners to focus attention on the center content) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(24,15,13,0.92)_100%)] pointer-events-none z-10" />

      {/* 2. Base Espresso Gradient Layer (Java Brown & Potting Soil) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#4A2E27_0%,#231815_75%,#120c0a_100%)] opacity-95" />
      <div className="absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-[#4D0E12]/8 to-transparent blur-[120px]" />

      {/* 3. Central Soft Warm Glow behind Hero Section (Responsive to CTA Hover) */}
      <motion.div
        className="absolute w-[600px] sm:w-[850px] h-[600px] sm:h-[850px] rounded-full bg-transparent-yellow/[0.04] blur-[140px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mix-blend-screen"
        animate={{
          scale: isButtonHovered ? [1, 1.05, 1] : [1, 1.03, 1],
          opacity: isButtonHovered ? [0.85, 1.05, 0.85] : [0.75, 0.90, 0.75]
        }}
        transition={{
          duration: isButtonHovered ? 6 : 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* 4. Celestial Geometry (Concentric hairline circular coordinate lines) */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] border-[0.5px] border-[#F5EFC8]/4 rounded-full pointer-events-none z-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 360, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[1250px] h-[1250px] border-[0.5px] border-[#A5BCD6]/3 rounded-full pointer-events-none border-dashed z-0"
        style={{ strokeDasharray: "3 9" }}
        animate={{ rotate: -360 }}
        transition={{ duration: 520, repeat: Infinity, ease: "linear" }}
      />

      {/* 5. Elegant Golden/Blue Line Art (Flowing silk ribbon curves emerging from borders) */}
      {/* Left trails */}
      <svg className="absolute left-0 top-[15%] w-[320px] sm:w-[480px] h-[70%] opacity-[0.09] text-transparent-yellow pointer-events-none z-0" viewBox="0 0 100 100" preserveAspectRatio="none">
        <motion.path
          d="M0,20 C32,38 58,8 82,48 C90,68 72,92 100,100"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.35"
          animate={{
            d: [
              "M0,20 C32,38 58,8 82,48 C90,68 72,92 100,100",
              "M0,22 C37,32 54,14 84,46 C88,72 74,90 100,100",
              "M0,20 C32,38 58,8 82,48 C90,68 72,92 100,100"
            ]
          }}
          transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
      {/* Right trails */}
      <svg className="absolute right-0 top-[10%] w-[340px] sm:w-[500px] h-[80%] opacity-[0.07] text-cerulean-blue pointer-events-none z-0" viewBox="0 0 100 100" preserveAspectRatio="none">
        <motion.path
          d="M100,10 C72,28 48,12 32,58 C18,88 32,97 0,100"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.35"
          animate={{
            d: [
              "M100,10 C72,28 48,12 32,58 C18,88 32,97 0,100",
              "M100,8 C68,32 50,10 34,56 C20,86 30,99 0,100",
              "M100,10 C72,28 48,12 32,58 C18,88 32,97 0,100"
            ]
          }}
          transition={{ duration: 32, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>

      {/* 6. Soft Vertical Light Beams near Center */}
      <div className="absolute top-0 bottom-0 left-[43%] w-[120px] bg-gradient-to-r from-transparent via-[#F5EFC8]/[0.015] to-transparent blur-[20px] pointer-events-none z-0" />
      <div className="absolute top-0 bottom-0 left-[54%] w-[140px] bg-gradient-to-r from-transparent via-[#F5EFC8]/[0.012] to-transparent blur-[25px] pointer-events-none z-0" />

      {/* 7. Floating Particles (Drifting slowly throughout the page - Client hydration only) */}
      {mounted && particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute pointer-events-none mix-blend-screen"
          style={{
            left: `${p.xStart}%`,
            top: `${p.yStart}%`,
            width: p.size,
            height: p.size,
            color: p.color,
          }}
          animate={{
            x: [0, p.xDrift, 0],
            y: [0, p.yDrift, 0],
            opacity: [0, 0.65, 0.65, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: p.delay,
          }}
        >
          {renderParticleContent(p.type)}
        </motion.div>
      ))}
    </div>
  );
}
