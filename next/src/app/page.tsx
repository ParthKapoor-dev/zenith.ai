"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { BorderBeam } from "@/components/ui/border-beam";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Brain,
  ArrowRight,
  Users,
  Rocket as Robot,
  ShieldCheck,
  TrendingUp,
  ArrowRightIcon,
  ChevronRight,
} from "lucide-react";
import { Meteors } from "@/components/ui/meteors";
import { SparklesCore } from "@/components/ui/sparkles";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { LargeFeatureSection } from "@/components/ui/large-feature-section";
import { SmallFeatureSection } from "@/components/ui/small-feature-section";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { cn } from "@/lib/utils";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";
import { ShinyButton } from "@/components/magicui/shiny-button";
import { useMediaQuery } from "@/hooks/use-media-query";
import { TextHoverMobile } from "@/components/ui/text-hover-mobile";

const LandingPage = () => {
  const heroWords = [
    { text: "Tech" },
    { text: "Hiring," },
    { text: "Reimagined" },
    { text: "with" },
    { text: "LLMs" },
  ];

  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div className="min-h-screen overflow-hidden ">
      {/* Hero Section */}
      <div className="relative py-16 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="absolute inset-0 z-0">
          <SparklesCore
            id="tsparticlesfullpage"
            background="transparent"
            minSize={0.4}
            maxSize={1.2}
            particleDensity={isMobile ? 60 : 100}
            className="w-full h-full"
            particleColor="#8a4bff"
          />
        </div>
        <div className="relative z-10 text-center">
          <AnimatedGradientText className="mb-2 sm:mb-4 flex items-center justify-center">
            🎉
            <hr className="mx-2 h-3 sm:h-4 w-px shrink-0 bg-gray-300" />
            <span
              className={cn(
                `inline animate-gradient bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent text-sm sm:text-base`
              )}
            >
              Introducing Zenith AI
            </span>
            <ChevronRight className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
          </AnimatedGradientText>
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-4 sm:mb-8"
          >
            {isMobile ? (
              <TextHoverMobile
                text="ZENITH AI"
                fontSize="text-3xl"
                duration={0.1}
                automatic={true}
              />
            ) : (
              <TextHoverEffect
                text="ZENITH AI"
                duration={0.1}
                automatic={true}
              />
            )}
            <div className="mt-2 sm:mt-4">
              <TypewriterEffect words={heroWords} />
            </div>
            <TextGenerateEffect
              words="The Smartest Way to Build Your Tech Team"
              className="sm:text-xl text-slate-600 dark:text-slate-300 mt-2 sm:mt-4"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex justify-center items-center gap-3"
          >
            <ShinyButton>Job Seeker</ShinyButton>
            <ShinyButton className="">Recruiter</ShinyButton>
          </motion.div>
        </div>
      </div>

      <LargeFeatureSection />

      <SmallFeatureSection />

      {/* Footer */}
      <footer className="py-8 text-center">
        <p className="text-slate-600 dark:text-slate-400">
          © 2024 Zenith AI. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
