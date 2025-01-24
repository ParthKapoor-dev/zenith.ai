"use client"

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BorderBeam } from '@/components/ui/border-beam';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, ArrowRight, Users, Rocket as Robot, ShieldCheck, TrendingUp, ArrowRightIcon, ChevronRight } from 'lucide-react';
import { Meteors } from '@/components/ui/meteors';
import { SparklesCore } from '@/components/ui/sparkles';
import { TypewriterEffect } from '@/components/ui/typewriter-effect';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';
import { RainbowButton } from '@/components/ui/rainbow-button';
import { ShimmerButton } from '@/components/ui/shimmer-button';
import { LargeFeatureSection } from '@/components/ui/large-feature-section';
import { SmallFeatureSection } from '@/components/ui/small-feature-section';
import { AnimatedShinyText } from '@/components/ui/animated-shiny-text';
import { cn } from '@/lib/utils';
import { AnimatedGradientText } from '@/components/ui/animated-gradient-text';
import { TextHoverEffect } from '@/components/ui/text-hover-effect';

const LandingPage = () => {

  const heroWords = [
    { text: "Tech" },
    { text: "Hiring," },
    { text: "Reimagined" },
    { text: "with" },
    { text: "LLMs" },
  ];

  return (
    <div className="min-h-screen overflow-hidden ">

      {/* Hero Section */}
      <div className="relative py-24 px-6 max-w-7xl mx-aut">
        <div className="absolute inset-0 z-0">
          <SparklesCore
            id="tsparticlesfullpage"
            background="transparent"
            minSize={0.6}
            maxSize={1.4}
            particleDensity={100}
            className="w-full h-full"
            particleColor="#8a4bff"
          />
        </div>

        <div className="relative z-10 text-center ">

          <AnimatedGradientText className='mb-4'>
            🎉 <hr className="mx-2  h-4 w-px shrink-0 bg-gray-300" />{" "}
            <span
              className={cn(
                `inline animate-gradient bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent`,
              )}
            >
              Introducing Zenith AI
            </span>
            <ChevronRight className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
          </AnimatedGradientText>


          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >

            <TextHoverEffect
              text='Zenith AI'
            />

            <TypewriterEffect
              words={heroWords}
            />

            <TextGenerateEffect
              words="The Smartest Way to Build Your Tech Team"
              className="text-xl text-slate-600 dark:text-slate-300 mt-4"
            />

          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className='flex justify-center items-center gap-6'
          >
            <RainbowButton>
              Job Seeker
            </RainbowButton>

            <RainbowButton className='dark:text-white dark:bg-[linear-gradient(#000,#000),linear-gradient(#fff_50%,rgba(255,255,255,0.6)_80%,rgba(0,0,0,0)),linear-gradient(90deg,hsl(var(--color-1)),hsl(var(--color-5)),hsl(var(--color-3)),hsl(var(--color-4)),hsl(var(--color-2)))]   
            bg-[linear-gradient(#fff,#fff),linear-gradient(#121213_50%,rgba(18,18,19,0.6)_80%,rgba(18,18,19,0)),linear-gradient(90deg,hsl(var(--color-1)),hsl(var(--color-5)),hsl(var(--color-3)),hsl(var(--color-4)),hsl(var(--color-2)))] text-black'>
              Recruiter
            </RainbowButton>
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