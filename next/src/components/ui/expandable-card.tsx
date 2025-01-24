"use client";
import Image from "next/image";
import React, { RefObject, useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { ChevronRight } from "lucide-react";
import { RankedCandidate } from '@/types/chatbot';
import Candidate from "@/types/candidate";
import User from "@/types/user";


interface Cand extends Candidate {
    user: User;
}

interface RankedCand extends RankedCandidate {
    candidate: Cand;
}

export function ExpandableCard({ cards }: { cards: RankedCand[] }) {
    const [active, setActive] = useState<RankedCand | null>(null);
    const ref = useRef<HTMLDivElement | null>(null);
    const id = useId();

    useEffect(() => {
        function onKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setActive(null);
            }
        }

        if (active) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [active]);

    useOutsideClick(ref as RefObject<HTMLDivElement>, () => setActive(null));

    return (
        <>
            <AnimatePresence>
                {active && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/20 h-full w-full z-10"
                    />
                )}
            </AnimatePresence>
            <AnimatePresence>
                {active ? (
                    <div className="fixed inset-0 grid place-items-center z-[100]">
                        <motion.button
                            key={`button-${active.candidate.user.name}-${id}`}
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, transition: { duration: 0.05 } }}
                            className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
                            onClick={() => setActive(null)}
                        >
                            <CloseIcon />
                        </motion.button>
                        <motion.div
                            layoutId={`card-${active.candidate.user.name}-${id}`}
                            ref={ref}
                            className="w-full max-w-[500px] h-full md:h-fit md:max-h-[90%] flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden"
                        >
                            <div>
                                <div className="flex justify-between items-start p-4">
                                    <motion.div layoutId={`image-${active.candidate.user.name}-${id}`}>
                                        <Image
                                            width={100}
                                            height={100}
                                            src={active.candidate.user.image || "/https://assets.aceternity.com/demos/babbu-maan.jpeg"}
                                            alt={active.candidate.user.name}
                                            className="h-40 w-40 md:h-14 md:w-14 rounded-lg object-cover object-top"
                                        />
                                    </motion.div>
                                    <div>
                                        <motion.h3
                                            layoutId={`title-${active.candidate.user.name}-${id}`}
                                            className="font-bold text-neutral-700 dark:text-neutral-200"
                                        >
                                            {active.candidate.user.name}
                                        </motion.h3>
                                        {/* <motion.p
                                            layoutId={`description-${active.candidate.user.bio}-${id}`}
                                            className="text-neutral-600 dark:text-neutral-400"
                                        >
                                            {active.candidate.user.bio}
                                        </motion.p> */}
                                    </div>

                                    <motion.a
                                        layoutId={`button-${active.candidate.user.name}-${id}`}
                                        href={`/candidates/${active.candidate.userId}`}
                                        target="_blank"
                                        className="px-4 py-3 text-sm rounded-full font-bold bg-green-500 text-white"
                                    >
                                        View Profile
                                    </motion.a>
                                </div>
                                <div className="pt-4 relative px-4">
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="text-neutral-600 text-xs md:text-sm lg:text-base h-40 md:h-fit pb-10 flex flex-col items-start gap-4 overflow-auto dark:text-neutral-400 [mask:linear-gradient(to_bottom,white,white,transparent)] [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]"
                                    >
                                        <p>Score: {active.score}</p>
                                        <p>Email: {active.candidate.user.email}</p>
                                        {/* <p>Location: {active.candidate.user.location}</p>
                                        <p>Skills: {active.candidate.skills.join(", ")}</p> */}
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                ) : null}
            </AnimatePresence>
            <ul className="max-w-2xl mx-auto w-full gap-4">
                {cards.map((card, index) => (
                    <motion.div
                        layoutId={`card-${card.candidate.user.name}-${id}`}
                        key={`card-${card.candidate.user.name}-${id}`}
                        onClick={() => setActive(card)}
                        className="p-4 flex flex-col md:flex-row justify-between items-center hover:bg-neutral-50 dark:hover:bg-zinc-600  rounded-xl cursor-pointer"
                    >
                        <div className="flex gap-4 flex-col md:flex-row">
                            <motion.div layoutId={`image-${card.candidate.user.name}-${id}`}>
                                <Image
                                    width={100}
                                    height={100}
                                    src={card.candidate.user.image || "/https://assets.aceternity.com/demos/babbu-maan.jpeg"}
                                    alt={card.candidate.user.name}
                                    className="h-40 w-40 md:h-14 md:w-14 rounded-lg object-cover object-top"
                                />
                            </motion.div>
                            <div>
                                <motion.h3
                                    layoutId={`title-${card.candidate.user.name}-${id}`}
                                    className="font-medium text-neutral-800 dark:text-neutral-200 text-center md:text-left"
                                >
                                    {card.candidate.user.name}
                                </motion.h3>
                                {/* <motion.p
                                    layoutId={`description-${card.candidate.user.bio}-${id}`}
                                    className="text-neutral-600 dark:text-neutral-400 text-center md:text-left"
                                >
                                    {card.candidate.user.bio}
                                </motion.p> */}
                            </div>
                        </div>
                        <motion.button
                            layoutId={`button-${card.candidate.user.name}-${id}`}
                            className="px-4 py-2 text-sm rounded-full font-bold bg-gray-100 hover:bg-green-500 hover:text-white text-black mt-4 md:mt-0"
                        >
                            View Profile
                        </motion.button>
                    </motion.div>
                ))}
            </ul>
        </>
    );
}

export const CloseIcon = () => {
    return (
        <motion.svg
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.05 } }}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 text-black"
        >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M18 6l-12 12" />
            <path d="M6 6l12 12" />
        </motion.svg>
    );
};