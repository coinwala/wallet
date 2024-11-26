"use client";

import React, { useCallback, useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";

const GRID_WIDTH = 15;
const GRID_HEIGHT = 10;
const CELL_SIZE = 100;
const MAX_ACTIVE_BEAMS = 5;

const borderTypes = ["top", "right", "bottom", "left"] as const;
type BorderType = (typeof borderTypes)[number];

interface BeamInfo {
  row: number;
  col: number;
  borderType: BorderType;
  key: string;
}

export default function AnimatedGridSvg() {
  const [activeBeams, setActiveBeams] = useState<BeamInfo[]>([]);

  const getCellBorderPath = useCallback(
    (row: number, col: number, borderType: BorderType) => {
      const x = col * CELL_SIZE;
      const y = row * CELL_SIZE;

      // Create more dynamic, beam-like paths
      switch (borderType) {
        case "top":
          return `
            M ${x} ${y} 
            C ${x + CELL_SIZE / 4} ${y - CELL_SIZE / 4}, 
              ${x + (CELL_SIZE * 3) / 4} ${y - CELL_SIZE / 4}, 
              ${x + CELL_SIZE} ${y}
          `;
        case "right":
          return `
            M ${x + CELL_SIZE} ${y} 
            C ${x + CELL_SIZE + CELL_SIZE / 4} ${y + CELL_SIZE / 4}, 
              ${x + CELL_SIZE + CELL_SIZE / 4} ${y + (CELL_SIZE * 3) / 4}, 
              ${x + CELL_SIZE} ${y + CELL_SIZE}
          `;
        case "bottom":
          return `
            M ${x + CELL_SIZE} ${y + CELL_SIZE} 
            C ${x + (CELL_SIZE * 3) / 4} ${y + CELL_SIZE + CELL_SIZE / 4}, 
              ${x + CELL_SIZE / 4} ${y + CELL_SIZE + CELL_SIZE / 4}, 
              ${x} ${y + CELL_SIZE}
          `;
        case "left":
          return `
            M ${x} ${y + CELL_SIZE} 
            C ${x - CELL_SIZE / 4} ${y + (CELL_SIZE * 3) / 4}, 
              ${x - CELL_SIZE / 4} ${y + CELL_SIZE / 4}, 
              ${x} ${y}
          `;
      }
    },
    []
  );

  useEffect(() => {
    const generateNewBeam = () => {
      const row = Math.floor(Math.random() * GRID_HEIGHT);
      const col = Math.floor(Math.random() * GRID_WIDTH);
      const borderType =
        borderTypes[Math.floor(Math.random() * borderTypes.length)];

      const newBeam: BeamInfo = {
        row,
        col,
        borderType,
        key: `beam-${row}-${col}-${borderType}-${Date.now()}`,
      };

      setActiveBeams((prev) => {
        if (prev.length >= MAX_ACTIVE_BEAMS) {
          return [...prev.slice(1), newBeam];
        }
        return [...prev, newBeam];
      });
    };

    generateNewBeam();
    const interval = setInterval(generateNewBeam, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-screen flex items-center justify-center bg-black">
      <svg
        aria-hidden="true"
        className="pointer-events-none"
        width={GRID_WIDTH * CELL_SIZE}
        height={GRID_HEIGHT * CELL_SIZE}
        viewBox={`0 0 ${GRID_WIDTH * CELL_SIZE} ${GRID_HEIGHT * CELL_SIZE}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Static grid cells */}
        {Array.from({ length: GRID_HEIGHT }).map((_, row) =>
          Array.from({ length: GRID_WIDTH }).map((_, col) => (
            <rect
              key={`cell-${row}-${col}`}
              x={col * CELL_SIZE}
              y={row * CELL_SIZE}
              width={CELL_SIZE}
              height={CELL_SIZE}
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="0.5"
              opacity="0.05"
            />
          ))
        )}

        {/* Animated beam paths */}
        {activeBeams.map((beam) => (
          <motion.path
            key={beam.key}
            d={getCellBorderPath(beam.row, beam.col, beam.borderType)}
            fill="none"
            stroke="url(#beamGradient)"
            strokeWidth="3"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: [0, 1.1],
              opacity: [0, 0.8, 0.8, 0],
            }}
            transition={{
              duration: 2,
              ease: "easeInOut",
              repeat: 0,
            }}
            style={{
              filter: "drop-shadow(0 0 6px rgba(100,200,255,0.7))",
            }}
          />
        ))}

        {/* Gradient definition */}
        <defs>
          <linearGradient id="beamGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(100,200,255,0)" />
            <stop offset="50%" stopColor="rgba(100,200,255,0.8)" />
            <stop offset="100%" stopColor="rgba(100,200,255,0)" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
