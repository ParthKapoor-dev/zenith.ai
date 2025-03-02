"use client";
import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMediaQuery } from "@/hooks/use-media-query";

export const TextHoverEffect = ({
  text,
  duration = 0.3,
  fontSize = "text-5xl",
  fontWeight = "font-bold",
  automatic = false,
}: {
  text: string;
  duration?: number;
  fontSize?: string;
  fontWeight?: string;
  automatic?: boolean;
}) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const svgRef = useRef<SVGSVGElement>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [maskPosition, setMaskPosition] = useState({ cx: "50%", cy: "50%" });
  const [autoAnimate, setAutoAnimate] = useState(false);

  // Effect for tracking cursor position relative to SVG
  useEffect(() => {
    if (svgRef.current && cursor.x !== null && cursor.y !== null) {
      const svgRect = svgRef.current.getBoundingClientRect();
      const cxPercentage = ((cursor.x - svgRect.left) / svgRect.width) * 100;
      const cyPercentage = ((cursor.y - svgRect.top) / svgRect.height) * 100;
      setMaskPosition({
        cx: `${cxPercentage}%`,
        cy: `${cyPercentage}%`,
      });
    }
  }, [cursor]);

  // Automatic animation effect
  useEffect(() => {
    if (automatic) {
      const interval = setInterval(() => {
        setAutoAnimate((prev) => !prev);
      }, 3000); // Toggle animation every 3 seconds

      return () => clearInterval(interval);
    }
  }, [automatic]);

  // Particle effect when hovered
  const [particles, setParticles] = useState<
    Array<{ x: number; y: number; id: number }>
  >([]);

  useEffect(() => {
    if (hovered || autoAnimate) {
      const createParticle = () => {
        const id = Date.now();
        const svgRect = svgRef.current?.getBoundingClientRect();
        if (svgRect) {
          const x = Math.random() * svgRect.width;
          const y = Math.random() * svgRect.height;

          setParticles((prev) => [...prev, { x, y, id }]);

          // Remove particle after animation
          setTimeout(() => {
            setParticles((prev) => prev.filter((p) => p.id !== id));
          }, 2000);
        }
      };

      const particleInterval = setInterval(createParticle, 200);
      return () => clearInterval(particleInterval);
    }
  }, [hovered, autoAnimate]);

  return (
    <div className="relative w-full h-full max-h-72">
      {/* Particle effects */}
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{
              opacity: 0.8,
              scale: 0,
              x: particle.x,
              y: particle.y,
            }}
            animate={{
              opacity: 0,
              scale: 2,
              y: particle.y - 50,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute w-1 h-1 rounded-full bg-gradient-to-r from-cyan-500 to-violet-500"
          />
        ))}
      </AnimatePresence>

      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox="0 0 300 80"
        xmlns="http://www.w3.org/2000/svg"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onMouseMove={(e) => setCursor({ x: e.clientX, y: e.clientY })}
        className="select-none"
      >
        <defs>
          <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            {(hovered || autoAnimate) && (
              <>
                <stop offset="0%" stopColor="#10B981">
                  <animate
                    attributeName="stop-color"
                    values="#10B981; #3B82F6; #8B5CF6; #EC4899; #10B981"
                    dur="4s"
                    repeatCount="indefinite"
                  />
                </stop>
                <stop offset="50%" stopColor="#3B82F6">
                  <animate
                    attributeName="stop-color"
                    values="#3B82F6; #8B5CF6; #EC4899; #10B981; #3B82F6"
                    dur="4s"
                    repeatCount="indefinite"
                  />
                </stop>
                <stop offset="100%" stopColor="#8B5CF6">
                  <animate
                    attributeName="stop-color"
                    values="#8B5CF6; #EC4899; #10B981; #3B82F6; #8B5CF6"
                    dur="4s"
                    repeatCount="indefinite"
                  />
                </stop>
              </>
            )}
          </linearGradient>

          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <motion.radialGradient
            id="revealMask"
            gradientUnits="userSpaceOnUse"
            r={hovered || autoAnimate ? "15%" : "20%"}
            animate={maskPosition}
            transition={{ duration, ease: "easeOut" }}
          >
            <stop offset="0%" stopColor="white" />
            <stop offset="80%" stopColor="gray" />
            <stop offset="100%" stopColor="black" />
          </motion.radialGradient>

          <mask id="textMask">
            <rect
              x="0"
              y="0"
              width="100%"
              height="100%"
              fill="url(#revealMask)"
            />
          </mask>
        </defs>

        {/* Background shimmer effect */}
        <motion.rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="none"
          stroke="url(#textGradient)"
          strokeWidth="0.2"
          strokeOpacity={hovered || autoAnimate ? 0.15 : 0}
          animate={{
            strokeDashoffset: [0, 1000],
            strokeDasharray: [5, 15],
          }}
          transition={{
            repeat: Infinity,
            duration: 20,
            ease: "linear",
          }}
        />

        {/* Background text - outline only */}
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          strokeWidth="0.3"
          strokeLinejoin="round" // Add this line
          strokeLinecap="round" // Add this line
          className={`font-sans ${fontWeight} stroke-neutral-200 dark:stroke-neutral-800 fill-transparent ${fontSize}`}
          style={{ opacity: hovered || autoAnimate ? 1 : 0 }}
        >
          {text}
        </text>

        {/* Main text that animates in */}
        <motion.text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          strokeWidth={isMobile ? "1" : "0.3"}
          strokeLinejoin="round" // Add this line
          strokeLinecap="round" // Add this line
          className={`font-sans ${fontWeight} fill-purple-100/40 dark:fill-purple-400/20 ${fontSize} stroke-purple-400 dark:stroke-purple-700`}
          initial={{ strokeDashoffset: 1000, strokeDasharray: 1000 }}
          animate={{
            strokeDashoffset: 0,
            strokeDasharray: 1000,
          }}
          transition={{
            duration: 10,
            ease: "easeInOut",
          }}
        >
          {text}
        </motion.text>

        {/* Gradient text revealed by mask */}
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          stroke="url(#textGradient)"
          strokeWidth="1.0"
          strokeLinejoin="round"
          strokeLinecap="round"
          fill="url(#textGradient)"
          fillOpacity="0.8"
          mask="url(#textMask)"
          filter="url(#glow)"
          className={`font-sans ${fontWeight} ${fontSize}`}
        >
          {text}
        </text>

        {/* Particle dots around text when hovered */}
        {(hovered || autoAnimate) &&
          Array.from({ length: 10 }).map((_, i) => (
            <motion.circle
              key={i}
              r="0.8"
              fill="url(#textGradient)"
              initial={{
                opacity: 0,
                cx: 150 + Math.cos((i / 10) * Math.PI * 2) * 120,
                cy: 40 + Math.sin((i / 10) * Math.PI * 2) * 30,
              }}
              animate={{
                opacity: [0, 0.8, 0],
                cx: [
                  150 + Math.cos((i / 10) * Math.PI * 2) * 120,
                  150 + Math.cos((i / 10) * Math.PI * 2 + 0.5) * 140,
                  150 + Math.cos((i / 10) * Math.PI * 2 + 1) * 120,
                ],
                cy: [
                  40 + Math.sin((i / 10) * Math.PI * 2) * 30,
                  40 + Math.sin((i / 10) * Math.PI * 2 + 0.5) * 40,
                  40 + Math.sin((i / 10) * Math.PI * 2 + 1) * 30,
                ],
              }}
              transition={{
                duration: 3,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "reverse",
                delay: i * 0.2,
              }}
            />
          ))}
      </svg>
    </div>
  );
};
