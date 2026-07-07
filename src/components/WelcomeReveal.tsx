"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface WelcomeRevealProps {
  onComplete: () => void;
}

export default function WelcomeReveal({ onComplete }: WelcomeRevealProps) {
  const [isShrunk, setIsShrunk] = useState(false);
  const [showText, setShowText] = useState(true);
  const [windowWidth, setWindowWidth] = useState(1024);

  useEffect(() => {
    // Detect window width client-side
    if (typeof window !== "undefined") {
      setWindowWidth(window.innerWidth);
      const handleResize = () => setWindowWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  useEffect(() => {
    // Stage 1: Shrink Ganesha and fade out text (at 2.2 seconds)
    const t1 = setTimeout(() => {
      setShowText(false);
      setIsShrunk(true);
    }, 2200);

    // Stage 2: Complete and trigger home reveal (at 3.4 seconds)
    const t2 = setTimeout(() => {
      onComplete();
    }, 3400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onComplete]);

  const isMobile = windowWidth < 768;
  const targetY = isMobile ? -220 : -280;

  return (
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none">
      {/* Central warm gold glow behind Ganesha (shrinks/fades slightly with it) */}
      <motion.div
        className="absolute w-[350px] h-[350px] sm:w-[550px] sm:h-[550px] rounded-full bg-transparent-yellow/[0.12] blur-[110px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mix-blend-screen"
        animate={{
          scale: isShrunk ? 0.35 : 1,
          opacity: isShrunk ? 0.45 : 0.7,
          y: isShrunk ? targetY : 0,
        }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Ganesha & Text container */}
      <div className="relative z-40 flex flex-col items-center justify-center">
        {/* Ganesha Image (moves to top and shrinks) */}
        <motion.img
          layoutId="ganesha-emblem-shared"
          src="/ganesha.png"
          alt="Ganesha"
          className="h-auto object-contain drop-shadow-[0_0_35px_rgba(245,239,200,0.18)]"
          initial={{ scale: 0.82, y: 22, opacity: 0 }}
          animate={{
            scale: isShrunk ? 0.3 : 1,
            y: isShrunk ? targetY : 0,
            opacity: 1,
          }}
          transition={{
            duration: 1.2,
            ease: [0.16, 1, 0.3, 1],
            scale: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
            y: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
          }}
          style={{
            width: 240, // Base width, scale controls size
          }}
        />

        {/* Sanskrit Salutation */}
        <div className="h-16 flex items-center justify-center">
          <AnimatePresence>
            {showText && (
              <motion.h2
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 0.95, y: 0 }}
                exit={{ opacity: 0, y: -10, transition: { duration: 0.5 } }}
                transition={{ delay: 0.75, duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
                className="text-lg sm:text-2xl font-serif italic text-transparent-yellow tracking-[0.25em] uppercase mt-8 text-center drop-shadow-[0_0_20px_rgba(245,239,200,0.22)]"
              >
                gurobhuo namaha
              </motion.h2>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
