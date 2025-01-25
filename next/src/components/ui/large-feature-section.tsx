import React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import createGlobe from "cobe";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { IconBrandFlutter, IconBrandGolang, IconBrandNextjs, IconBrandOpenai, IconBrandReact, IconBrandVercel, IconBrandYoutubeFilled, IconCodePlus, IconForms, IconLink, IconMessageChatbot, IconServer } from "@tabler/icons-react";
import Link from "next/link";
import { BorderBeam } from "./border-beam";
import { useTheme } from "next-themes";
import { OrbitingCircles } from "./orbiting-circles";
import { FaAws, FaDocker, FaNodeJs, FaPython, FaRust, FaWhatsapp } from "react-icons/fa";
import { Share, User } from "lucide-react";

export function LargeFeatureSection() {
    const features = [
        {
            title: "Intelligent Screening Chatbot",
            description:
                "Interactive AI assistant that helps you refine your search criteria and understand candidate potential.",

            skeleton: <SkeletonOne />,
            className:
                "col-span-1 lg:col-span-4 border-b lg:border-r dark:border-neutral-800",
        },
        {
            title: "AI-Powered Candidate Matching",
            description:
                "Get an AI-generated ranked list of candidates based on your exact technical requirements and team needs."
            ,
            skeleton: <SkeletonTwo />,
            className: "border-b col-span-1 lg:col-span-2 dark:border-neutral-800",
        },
        {
            title: "Custom Candidate Evaluation Forms",
            description:
                "Create dynamic, role-specific questionnaires to capture precise candidate insights.",
            skeleton: <SkeletonThree />,
            className:
                "col-span-1 lg:col-span-3 lg:border-r dark:border-neutral-800",
        },
        {
            title: "Global Tech Talent, Instantly Matched.",
            description:
                "Find and hire the best tech professionals from around the world. Our AI understands your needs and connects you with top candidates, effortlessly.",
            skeleton: <SkeletonFour />,
            className: "col-span-1 lg:col-span-3 border-b lg:border-none",
        },
    ];
    return (
        <div className="relative z-20 py-10 lg:py-40 max-w-7xl mx-auto">
            <div className="px-8">
                <h4 className="text-3xl lg:text-5xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium text-black dark:text-white">
                    Solve Your Hiring Challenges with AI
                </h4>

                <p className="text-sm lg:text-base  max-w-2xl  my-4 mx-auto text-neutral-500 text-center font-normal dark:text-neutral-300">
                    Streamline your tech hiring process with intelligent matching, screening, and evaluation tools
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-6 mt-12 xl:border rounded-md dark:border-neutral-800 relative bg-white dark:bg-purple-100/10">
                {features.map((feature) => (
                    <FeatureCard key={feature.title} className={feature.className}>
                        <FeatureTitle>{feature.title}</FeatureTitle>
                        <FeatureDescription>{feature.description}</FeatureDescription>
                        <div className=" h-full w-full">{feature.skeleton}</div>
                    </FeatureCard>
                ))}
                <BorderBeam size={1000} duration={3} />
            </div>
        </div>
    );
}

const FeatureCard = ({
    children,
    className,
}: {
    children?: React.ReactNode;
    className?: string;
}) => {
    return (
        <div className={cn(`p-4 sm:p-8 relative overflow-hidden hover:bg-purple-100/10 duration-200`, className)}>
            {children}
        </div>
    );
};

const FeatureTitle = ({ children }: { children?: React.ReactNode }) => {
    return (
        <p className=" max-w-5xl mx-auto text-left tracking-tight text-black dark:text-white text-xl md:text-2xl md:leading-snug">
            {children}
        </p>
    );
};

const FeatureDescription = ({ children }: { children?: React.ReactNode }) => {
    return (
        <p
            className={cn(
                "text-sm md:text-base  max-w-4xl text-left mx-auto",
                "text-neutral-500 text-center font-normal dark:text-neutral-300",
                "text-left max-w-sm mx-0 md:text-sm my-2"
            )}
        >
            {children}
        </p>
    );
};

export const SkeletonOne = () => {
    const { theme } = useTheme();
    let src = '/chatbot-light-1.png'
    if (theme == 'light') src = '/chatbot-dark-1.png'

    return (
        <div className="relative flex py-8 px-2 gap-10 h-full">
            <div className="flex flex-1 w-full h-full flex-col space-y-2  ">
                {/* TODO */}
                <Image
                    suppressHydrationWarning
                    src={src}
                    alt="header"
                    width={800}
                    height={800}
                    className="h-full w-full object-contain object-left-top rounded-sm"
                />
            </div>

            {/* <div className="absolute bottom-0 z-40 inset-x-0 h-60 bg-gradient-to-t from-white dark:from-black via-white dark:via-black to-transparent w-full pointer-events-none" />
            <div className="absolute top-0 z-40 inset-x-0 h-60 bg-gradient-to-b from-white dark:from-black via-transparent to-transparent w-full pointer-events-none" /> */}
        </div>
    );
};

export const SkeletonThree = () => {
    const formStages = [
        { icon: <IconForms />, label: "Create" },
        { icon: <IconLink />, label: "Generate Link" },
        { icon: <Share />, label: "Share" },
        { icon: <User />, label: "Candidate Fills" }
    ];

    return (
        <div className="relative flex flex-col items-center justify-center p-8 space-y-6">
            <div className="flex items-center justify-between w-full">
                {formStages.map((stage, index) => (
                    <motion.div
                        key={stage.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            delay: index * 0.2,
                            type: "spring",
                            stiffness: 300
                        }}
                        className="flex flex-col items-center space-y-2"
                    >
                        <div className="rounded-full p-3 text-white bg-neutral-800 border  border-neutral-700 shadow-md">
                            {stage.icon}
                        </div>
                        <span className="text-sm text-neutral-600 dark:text-neutral-300">
                            {stage.label}
                        </span>
                    </motion.div>
                ))}
            </div>

            <div className="w-full h-1 bg-purple-200 z-0 top-1/3 transform -translate-y-1/2" />

            <div className=" p-4 w-full bg-neutral-800 dark:bg-neutral-900 rounded-xl shadow-lg border border-neutral-100 dark:border-neutral-700">
                <div className="flex items-center space-x-3">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="h-6 w-6 text-purple-600"
                    >
                        <path
                            fill="currentColor"
                            d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"
                        />
                    </svg>
                    <input
                        type="text"
                        readOnly
                        value="https://zenith.ai/form/tech-candidate-1234"
                        className="w-full text-sm text-neutral-600 bg-neutral-500 dark:bg-neutral-800 rounded-md px-2 py-1"
                    />
                    <button className="bg-purple-600 text-white px-3 py-1 rounded-md text-sm">
                        Copy
                    </button>
                </div>
            </div>
        </div>
    );
};

export const SkeletonTwo = () => {
    return (
        <div className="relative flex h-[500px]  flex-col items-center justify-center text-purple-400/90 dark:text-cyan-400/90">
            <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300 bg-clip-text text-center text-5xl font-semibold leading-none text-transparent dark:from-white dark:to-transparent">
                Choose your Tech Stack
            </span>

            <OrbitingCircles iconSize={40}>
                <FaRust size={40} />
                <IconBrandOpenai size={40} />
                <IconBrandNextjs size={40} />
                <IconBrandGolang size={40} />
                <FaDocker size={40} />
                <IconBrandFlutter size={40} />
                <IconCodePlus size={40} />
            </OrbitingCircles>
            <OrbitingCircles iconSize={30} radius={100} reverse speed={2}>
                <IconServer size={40} />
                <FaNodeJs size={40} />
                <FaAws size={40} />
                <IconBrandVercel size={40} />
                <FaPython size={40} />
            </OrbitingCircles>
        </div>
    );
};

export const SkeletonFour = () => {
    return (
        <div className="h-60 md:h-60  flex flex-col items-center relative bg-transparent dark:bg-transparent mt-10">
            <Globe className="absolute -right-10 md:-right-10 -bottom-80 md:-bottom-72" />
        </div>
    );
};

export const Globe = ({ className }: { className?: string }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        let phi = 0;

        if (!canvasRef.current) return;

        const globe = createGlobe(canvasRef.current, {
            devicePixelRatio: 2,
            width: 600 * 2,
            height: 600 * 2,
            phi: 0,
            theta: 0,
            dark: 1,
            diffuse: 1.2,
            mapSamples: 16000,
            mapBrightness: 6,
            baseColor: [0.3, 0.3, 0.3],
            markerColor: [0.1, 0.8, 1],
            glowColor: [1, 1, 1],
            markers: [
                // longitude latitude
                { location: [37.7595, -122.4367], size: 0.03 },
                { location: [40.7128, -74.006], size: 0.1 },
            ],
            onRender: (state) => {
                // Called on every animation frame.
                // `state` will be an empty object, return updated params.
                state.phi = phi;
                phi += 0.01;
            },
        });

        return () => {
            globe.destroy();
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{ width: 600, height: 600, maxWidth: "100%", aspectRatio: 1 }}
            className={className}
        />
    );
};
