"use client";
import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const TextHoverMobile = ({
  text,
  duration = 0.3,
  fontSize = "text-7xl",
  fontWeight = "font-bold",
  automatic = false,
}: {
  text: string;
  duration?: number;
  fontSize?: string;
  fontWeight?: string;
  automatic?: boolean;
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [maskPosition, setMaskPosition] = useState({ cx: "50%", cy: "50%" });
  const [autoAnimate, setAutoAnimate] = useState(false);
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });

  // Effect for viewport size detection
  useEffect(() => {
    const updateSize = () => {
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", updateSize);
    updateSize();

    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Determine if we're on mobile
  const isMobile = viewportSize.width < 640;

  // Force the mask to center on mobile
  useEffect(() => {
    if (isMobile) {
      setMaskPosition({ cx: "50%", cy: "50%" });
    }
  }, [isMobile]);

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
    if (automatic || isMobile) {
      const animateMask = () => {
        if (svgRef.current) {
          const svgRect = svgRef.current.getBoundingClientRect();
          const centerX = svgRect.width / 2;
          const centerY = svgRect.height / 2;

          // Create a circular path for the mask
          const radius = Math.min(svgRect.width, svgRect.height) * 0.4;
          const angle = (Date.now() / 2000) % (2 * Math.PI);

          const x = centerX + Math.cos(angle) * radius;
          const y = centerY + Math.sin(angle) * radius;

          const cxPercentage = (x / svgRect.width) * 100;
          const cyPercentage = (y / svgRect.height) * 100;

          setMaskPosition({
            cx: `${cxPercentage}%`,
            cy: `${cyPercentage}%`,
          });
        }
      };

      setAutoAnimate(true);
      const interval = setInterval(animateMask, 50);
      return () => clearInterval(interval);
    }
  }, [automatic, isMobile]);

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

      // Use fewer particles on mobile
      const interval = isMobile ? 300 : 200;
      const particleInterval = setInterval(createParticle, interval);
      return () => clearInterval(particleInterval);
    }
  }, [hovered, autoAnimate, isMobile]);

  // Dynamic viewBox based on screen size
  const getViewBox = () => {
    const baseWidth = 300;
    // Make text appear larger on mobile by reducing viewBox height
    const height = isMobile ? 60 : 80;
    return `0 0 ${baseWidth} ${height}`;
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-visible"
      style={{
        height: isMobile ? "100px" : "100px",
        margin: isMobile ? "30px 0" : "0",
        // marginBottom: isMobile ? '20px' : '0'
      }}
    >
      {/* Particle effects */}
      <AnimatePresence>
        {!isMobile &&
          particles.map((particle) => (
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
        viewBox={getViewBox()}
        xmlns="http://www.w3.org/2000/svg"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onMouseMove={(e) => setCursor({ x: e.clientX, y: e.clientY })}
        className="select-none"
        style={{
          display: "block",
          marginLeft: "auto",
          marginRight: "auto",
        }}
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

          <filter id="glow" x="-20%" y="-20%" width="200%" height="140%">
            <feGaussianBlur stdDeviation={isMobile ? "3" : "4"} result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <motion.radialGradient
            id="revealMask"
            gradientUnits="userSpaceOnUse"
            // Change this line to make the mask cover the entire text on mobile
            r={
              hovered || (autoAnimate && !isMobile)
                ? "45%"
                : isMobile
                ? "200%"
                : "100%"
            }
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
          className={`font-sans ${fontWeight} stroke-neutral-200 dark:stroke-neutral-800 fill-transparent`}
          style={{
            opacity: hovered || autoAnimate ? 1 : 0,
            fontSize: isMobile ? "60px" : "40px",
          }}
        >
          {text}
        </text>

        {/* Main text that animates in */}
        <motion.text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          strokeWidth="0.3"
          className={`font-sans ${fontWeight} fill-zinc-200 dark:fill-purple-100/10 stroke-neutral-300 dark:stroke-neutral-600`}
          style={{ fontSize: isMobile ? "60px" : "40px" }}
          initial={{ strokeDashoffset: 1000, strokeDasharray: 1000 }}
          animate={{
            strokeDashoffset: 0,
            strokeDasharray: 1000,
          }}
          transition={{
            duration: 4,
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
          strokeWidth={isMobile ? "1.2" : "1.5"}
          fill="url(#textGradient)"
          fillOpacity="0.6"
          mask="url(#textMask)"
          filter="url(#glow)"
          className={`font-sans ${fontWeight}`}
          style={{ fontSize: isMobile ? "60px" : "40px" }}
        >
          {text}
        </text>

        {/* Particle dots around text when hovered - fewer on mobile */}
        {(hovered || autoAnimate) &&
          Array.from({ length: isMobile ? 5 : 10 }).map((_, i) => (
            <motion.circle
              key={i}
              r={isMobile ? "0.6" : "0.8"}
              fill="url(#textGradient)"
              initial={{
                opacity: 0,
                cx:
                  150 +
                  Math.cos((i / (isMobile ? 5 : 10)) * Math.PI * 2) *
                    (isMobile ? 100 : 120),
                cy:
                  (isMobile ? 30 : 40) +
                  Math.sin((i / (isMobile ? 5 : 10)) * Math.PI * 2) *
                    (isMobile ? 20 : 30),
              }}
              animate={{
                opacity: [0, 0.8, 0],
                cx: [
                  150 +
                    Math.cos((i / (isMobile ? 5 : 10)) * Math.PI * 2) *
                      (isMobile ? 100 : 120),
                  150 +
                    Math.cos((i / (isMobile ? 5 : 10)) * Math.PI * 2 + 0.5) *
                      (isMobile ? 110 : 140),
                  150 +
                    Math.cos((i / (isMobile ? 5 : 10)) * Math.PI * 2 + 1) *
                      (isMobile ? 100 : 120),
                ],
                cy: [
                  (isMobile ? 30 : 40) +
                    Math.sin((i / (isMobile ? 5 : 10)) * Math.PI * 2) *
                      (isMobile ? 20 : 30),
                  (isMobile ? 30 : 40) +
                    Math.sin((i / (isMobile ? 5 : 10)) * Math.PI * 2 + 0.5) *
                      (isMobile ? 25 : 40),
                  (isMobile ? 30 : 40) +
                    Math.sin((i / (isMobile ? 5 : 10)) * Math.PI * 2 + 1) *
                      (isMobile ? 20 : 30),
                ],
              }}
              transition={{
                duration: isMobile ? 2 : 3,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "reverse",
                delay: i * (isMobile ? 0.3 : 0.2),
              }}
            />
          ))}
      </svg>
    </div>
  );
};
