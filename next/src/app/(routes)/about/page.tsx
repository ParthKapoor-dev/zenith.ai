"use client";

import React from "react";
import { motion } from "framer-motion";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { SparklesCore } from "@/components/ui/sparkles";
import { TracingBeam } from "@/components/ui/tracing-beam";
import { StickyScroll } from "@/components/ui/sticky-scroll";
import { GlowingStarsBackgroundCard } from "@/components/ui/glowing-stars";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen relative">
      <TracingBeam className="px-4 max-md:hidden">
        <Page />
      </TracingBeam>
      <div className="hidden max-md:block">
        {" "}
        <Page />{" "}
      </div>
    </div>
  );
}

function Page() {
  return (
    <div>
      {/* Hero Section with Background Effects */}
      <section className="relative h-screen max-md:h-fit max-md:my-20 min-w-full flex items-center justify-center overflow-hidden">
        <BackgroundBeams className="absolute inset-0 opacity-40" />
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h1 className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-violet-600 dark:from-blue-400 dark:via-purple-400 dark:to-violet-500">
              About Zenith AI
            </h1>
            <TextGenerateEffect
              words="Revolutionizing tech recruitment through advanced artificial intelligence and human-centered design."
              className="text-xl mb-8 text-gray-800 dark:text-gray-200 max-w-2xl mx-auto"
            />
            <div className="flex justify-center gap-4 mt-8">
              <Link href={"/"}>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 rounded-full px-8"
                >
                  Explore Platform
                </Button>
              </Link>
              <Link href={"mailto:parthkapoor.coder@gmail.com"}>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-blue-500 text-blue-500 dark:text-blue-400 dark:border-blue-400 rounded-full px-8 hover:bg-blue-500/10"
                >
                  Contact Us
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
        <div className="absolute inset-0 w-full h-full">
          <SparklesCore
            id="tsparticles"
            background="transparent"
            minSize={0.6}
            maxSize={1.4}
            particleDensity={70}
            className="w-full h-full"
            particleColor="#6366f1"
          />
        </div>
      </section>

      {/* About the Founder */}
      <section className=" mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-lg opacity-70"></div>
            <Avatar className="relative w-64 h-64 rounded-full border-4 border-white dark:border-gray-800 shadow-xl">
              <Link href={"https://parthkapoor.me"}>
                <AvatarImage src="https://github.com/parthKapoor-dev.png" />
              </Link>
            </Avatar>
          </div>
          <div className="text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                About the Founder
              </h2>
              <p className="text-xl mb-6 text-gray-800 dark:text-gray-200">
                Zenith AI is the brainchild of <strong>Parth Kapoor</strong>, a
                passionate Full-Stack AI Developer with a vision to innovate the
                tech recruitment industry.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                With a strong background in AI and software development, Parth
                is committed to creating solutions that bridge the gap between
                recruiters and exceptional tech talent. His expertise in machine
                learning algorithms and user experience design has shaped Zenith
                AI into the powerful platform it is today.
              </p>
              <Link
                href="https://linkedin.com/in/parthkapoor08"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 rounded-full px-8 py-2"
              >
                Connect on LinkedIn
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 relative">
        <BackgroundBeams className="absolute inset-0 opacity-30" />
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              Ready to Transform Your Tech Hiring?
            </h2>
            <p className="text-xl mb-8 text-gray-800 dark:text-gray-200">
              Join hundreds of companies that have streamlined their recruitment
              process with Zenith AI and discovered exceptional talent.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 rounded-full px-8"
              >
                Get Started
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-blue-500 text-blue-500 dark:text-blue-400 dark:border-blue-400 rounded-full px-8 hover:bg-blue-500/10"
              >
                Request Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: "500+", label: "Companies" },
            { value: "10,000+", label: "Candidates" },
            { value: "95%", label: "Hiring Success" },
            { value: "60%", label: "Time Saved" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-800 shadow-lg"
            >
              <div className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                {stat.value}
              </div>
              <div className="text-gray-600 dark:text-gray-300">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                Zenith AI
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Where technology meets talent.
              </p>
              <div className="flex space-x-4 mt-4">
                <span className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-blue-500 dark:text-blue-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
                  </svg>
                </span>
                <span className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-blue-500 dark:text-blue-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z" />
                  </svg>
                </span>
                <span className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-blue-500 dark:text-blue-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                  </svg>
                </span>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-gray-800 dark:text-gray-200">
                Company
              </h4>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li className="hover:text-blue-500 dark:hover:text-blue-400 cursor-pointer transition-colors">
                  About
                </li>
                <li className="hover:text-blue-500 dark:hover:text-blue-400 cursor-pointer transition-colors">
                  Careers
                </li>
                <li className="hover:text-blue-500 dark:hover:text-blue-400 cursor-pointer transition-colors">
                  Blog
                </li>
                <li className="hover:text-blue-500 dark:hover:text-blue-400 cursor-pointer transition-colors">
                  Press
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-gray-800 dark:text-gray-200">
                Resources
              </h4>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li className="hover:text-blue-500 dark:hover:text-blue-400 cursor-pointer transition-colors">
                  Documentation
                </li>
                <li className="hover:text-blue-500 dark:hover:text-blue-400 cursor-pointer transition-colors">
                  API
                </li>
                <li className="hover:text-blue-500 dark:hover:text-blue-400 cursor-pointer transition-colors">
                  Integrations
                </li>
                <li className="hover:text-blue-500 dark:hover:text-blue-400 cursor-pointer transition-colors">
                  Support
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-gray-800 dark:text-gray-200">
                Connect
              </h4>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li className="hover:text-blue-500 dark:hover:text-blue-400 cursor-pointer transition-colors">
                  Twitter
                </li>
                <li className="hover:text-blue-500 dark:hover:text-blue-400 cursor-pointer transition-colors">
                  LinkedIn
                </li>
                <li className="hover:text-blue-500 dark:hover:text-blue-400 cursor-pointer transition-colors">
                  GitHub
                </li>
                <li className="hover:text-blue-500 dark:hover:text-blue-400 cursor-pointer transition-colors">
                  Contact
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-gray-600 dark:text-gray-400">
            <p>© {new Date().getFullYear()} Zenith AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
