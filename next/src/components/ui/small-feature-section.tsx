import React from "react";
import { useId } from "react";

export function SmallFeatureSection() {
    return (
        <div className="flex flex-col gap-8">

            <div className="px-8">
                <h4 className="text-3xl lg:text-5xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium text-black dark:text-white">
                    Unlock Global Tech Opportunities with AI
                </h4>

                <p className="text-sm lg:text-base max-w-2xl my-4 mx-auto text-neutral-500 text-center font-normal dark:text-neutral-300">
                    Get matched with top jobs that align with your skills, experience, and preferences—powered by AI.
                </p>
            </div>



            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 md:gap-2 max-w-7xl mx-auto">
                {grid.map((feature, index) => (
                    <div
                        key={index}
                        className="relative bg-gradient-to-b dark:from-neutral-900 from-neutral-100 dark:to-purple-100/10 to-white p-6 rounded-3xl overflow-hidden"
                    >
                        <Grid size={20} />
                        <p className="text-base font-bold text-neutral-800 dark:text-white relative z-20">
                            {feature.title}
                        </p>
                        <p className="text-neutral-600 dark:text-neutral-400 mt-4 text-base font-normal relative z-20">
                            {feature.description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

const grid = [
    {
        title: "Personalized Job Matches",
        description:
            "Our AI analyzes your skills, experience, and preferences to connect you with the best job opportunities worldwide.",
    },
    {
        title: "One-Click Profile Setup",
        description:
            "Simply upload your resume, and our system will extract key details to build a professional profile in seconds.",
    },
    {
        title: "Global Opportunities",
        description:
            "Find remote, freelance, and full-time tech roles from top startups and companies across the world.",
    },
    {
        title: "AI-Powered Skill Assessment",
        description:
            "Showcase your expertise with AI-evaluated skill matching, ensuring you're considered for the right roles.",
    },
    {
        title: "Transparent Salary Insights",
        description:
            "Get job matches that align with your salary expectations, helping you find opportunities that truly fit your worth.",
    },
    {
        title: "Smart Application Tracking",
        description:
            "Easily track the progress of your applications and stay updated on employer interactions in one dashboard.",
    },
    {
        title: "Instant Interview Invitations",
        description:
            "Skip the long wait! Get direct interview invites from employers who match your expertise and expectations.",
    },
    {
        title: "Privacy & Data Security",
        description:
            "Your data is protected with industry-leading security measures, giving you complete control over your profile visibility.",
    },
];


export const Grid = ({
    pattern,
    size,
}: {
    pattern?: number[][];
    size?: number;
}) => {
    const p = pattern ?? [
        [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
        [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
        [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
        [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
        [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    ];
    return (
        <div className="pointer-events-none absolute left-1/2 top-0  -ml-20 -mt-2 h-full w-full [mask-image:linear-gradient(white,transparent)]">
            <div className="absolute inset-0 bg-gradient-to-r  [mask-image:radial-gradient(farthest-side_at_top,white,transparent)] dark:from-zinc-900/30 from-zinc-100/30 to-zinc-300/30 dark:to-zinc-900/30 opacity-100">
                <GridPattern
                    width={size ?? 20}
                    height={size ?? 20}
                    x="-12"
                    y="4"
                    squares={p}
                    className="absolute inset-0 h-full w-full  mix-blend-overlay dark:fill-white/10 dark:stroke-white/10 stroke-black/10 fill-black/10"
                />
            </div>
        </div>
    );
};

export function GridPattern({ width, height, x, y, squares, ...props }: any) {
    const patternId = useId();

    return (
        <svg aria-hidden="true" {...props} >
            <defs>
                <pattern
                    suppressHydrationWarning
                    id={patternId}
                    width={width}
                    height={height}
                    patternUnits="userSpaceOnUse"
                    x={x}
                    y={y}
                >
                    <path d={`M.5 ${height}V.5H${width}`} fill="none" />
                </pattern>
            </defs>
            <rect
                width="100%"
                height="100%"
                strokeWidth={0}
                fill={`url(#${patternId})`}
            />
            {squares && (
                <svg x={x} y={y} className="overflow-visible" >
                    {squares.map(([x, y]: any, index: number) => (
                        <rect
                            suppressHydrationWarning
                            strokeWidth="0"
                            key={index}
                            width={width + 1}
                            height={height + 1}
                            x={x * width}
                            y={y * height}
                        />
                    ))}
                </svg>
            )}
        </svg>
    );
}
