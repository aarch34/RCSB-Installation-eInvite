"use client";

import React from "react";
import { motion } from "framer-motion";

export default function CircularMotif() {
  const rayCount = 24;
  const rays = Array.from({ length: rayCount });

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 overflow-hidden">
      <motion.div
        className="w-[450px] h-[450px] sm:w-[600px] sm:h-[600px] md:w-[750px] md:h-[750px] text-transparent-yellow/35"
        animate={{ rotate: 360 }}
        transition={{
          duration: 180,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full opacity-[0.11]" /* Net opacity will be around 3.8% when multiplied by text-transparent-yellow/35 */
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Central Sun Circle */}
          <circle
            cx="50"
            cy="50"
            r="10"
            stroke="currentColor"
            strokeWidth="0.35"
            fill="none"
            strokeDasharray="0.8 1.2"
          />
          
          <circle
            cx="50"
            cy="50"
            r="10.5"
            stroke="currentColor"
            strokeWidth="0.15"
            fill="none"
          />

          {/* Inner Dotted Ring */}
          <circle
            cx="50"
            cy="50"
            r="20"
            stroke="currentColor"
            strokeWidth="0.25"
            fill="none"
            strokeDasharray="2 3"
          />

          {/* Outer Main Ring */}
          <circle
            cx="50"
            cy="50"
            r="32"
            stroke="currentColor"
            strokeWidth="0.4"
            fill="none"
          />

          {/* Micro outer ticks ring */}
          <circle
            cx="50"
            cy="50"
            r="32.8"
            stroke="currentColor"
            strokeWidth="0.15"
            fill="none"
            strokeDasharray="0.3 0.6"
          />

          {/* Radiating Rays (Rotary gear tooth style + Sunbeams) */}
          {rays.map((_, i) => {
            const angle = (i * 360) / rayCount;
            return (
              <React.Fragment key={i}>
                {/* Ray line segments */}
                <line
                  x1="50"
                  y1="29.5"
                  x2="50"
                  y2="13.5"
                  stroke="currentColor"
                  strokeWidth="0.3"
                  transform={`rotate(${angle} 50 50)`}
                />
                
                {/* Micro circle tip at the end of each ray */}
                <circle
                  cx="50"
                  cy="13.5"
                  r="0.4"
                  fill="currentColor"
                  transform={`rotate(${angle} 50 50)`}
                />

                {/* Micro gear-teeth segments on outer ring */}
                <line
                  x1="50"
                  y1="32"
                  x2="50"
                  y2="34.5"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  transform={`rotate(${angle + 7.5} 50 50)`}
                />
              </React.Fragment>
            );
          })}
        </svg>
      </motion.div>
    </div>
  );
}
