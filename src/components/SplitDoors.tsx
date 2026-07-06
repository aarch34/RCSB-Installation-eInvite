"use client";

import React from "react";
import { motion } from "framer-motion";

export default function SplitDoors() {
  const lineCount = 12;
  const lines = Array.from({ length: lineCount });

  return (
    <div className="fixed inset-0 z-40 pointer-events-none flex w-screen h-screen overflow-hidden">
      {/* Left Panel */}
      <motion.div
        className="relative w-1/2 h-full bg-[#231815] flex items-center justify-end overflow-hidden"
        style={{
          boxShadow: "15px 0 40px rgba(0,0,0,0.65)",
        }}
        initial={{ x: "0%" }}
        animate={{ x: "-100%" }}
        transition={{ duration: 1.5, ease: [0.77, 0, 0.175, 1], delay: 0.1 }}
      >
        {/* Right edge border highlight of left door */}
        <div className="absolute right-0 top-0 h-full w-[1.5px] bg-gradient-to-b from-transparent via-[#F5EFC8]/40 to-transparent" />
        
        {/* Subtle red depth panel shading */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#4D0E12]/5 pointer-events-none" />

        {/* Left half of a circular motif watermark */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 w-[350px] h-[350px] sm:w-[500px] sm:h-[500px] text-[#F5EFC8]/12 pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="0.35" fill="none" />
            <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="0.25" fill="none" strokeDasharray="2 3" />
            {lines.map((_, i) => (
              <line
                key={i}
                x1="50"
                y1="50"
                x2="50"
                y2="5"
                stroke="currentColor"
                strokeWidth="0.2"
                transform={`rotate(${i * 30} 50 50)`}
              />
            ))}
          </svg>
        </div>
      </motion.div>

      {/* Right Panel */}
      <motion.div
        className="relative w-1/2 h-full bg-[#231815] flex items-center justify-start overflow-hidden"
        style={{
          boxShadow: "-15px 0 40px rgba(0,0,0,0.65)",
        }}
        initial={{ x: "0%" }}
        animate={{ x: "100%" }}
        transition={{ duration: 1.5, ease: [0.77, 0, 0.175, 1], delay: 0.1 }}
      >
        {/* Left edge border highlight of right door */}
        <div className="absolute left-0 top-0 h-full w-[1.5px] bg-gradient-to-b from-transparent via-[#F5EFC8]/40 to-transparent" />
        
        {/* Subtle red depth panel shading */}
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#4D0E12]/5 pointer-events-none" />

        {/* Right half of the circular motif watermark */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-[350px] h-[350px] sm:w-[500px] sm:h-[500px] text-[#F5EFC8]/12 pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="0.35" fill="none" />
            <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="0.25" fill="none" strokeDasharray="2 3" />
            {lines.map((_, i) => (
              <line
                key={i}
                x1="50"
                y1="50"
                x2="50"
                y2="5"
                stroke="currentColor"
                strokeWidth="0.2"
                transform={`rotate(${i * 30} 50 50)`}
              />
            ))}
          </svg>
        </div>
      </motion.div>
    </div>
  );
}
