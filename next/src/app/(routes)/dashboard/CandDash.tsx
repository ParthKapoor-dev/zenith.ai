"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import User from "@/types/user";
import Candidate from "@/types/candidate";
import ProfileCard from "@/components/candidate/ProfileCard";
import List from "@/components/candidate/List";
import { LineShadowText } from "@/components/ui/line-shadow-text";

interface CandDashProps {
  user: User;
  candidate: Candidate;
}

const CandidateDashboard = ({ user, candidate }: CandDashProps) => {
  return (
    <div className="">
      <div className="max-w-7xl md:max-w-5xl mx-auto p-6 space-y-6">
        {/* Welcome Section */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent mb-2 leading-none tracking-tight">
            Welcome back, {user?.name || "Candidate"}
          </h1>
          <p className="text-slate-600 tracking-tight ">
            Your professional journey with Zenith AI
          </p>
        </motion.div>

        <div className="flex flex-col justify-center gap-4 ">
          {/* Profile Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <ProfileCard
              name={user.name}
              email={user.email}
              resume_link={candidate.resume}
              image={user.image || ""}
              rating={user.id}
            />
          </motion.div>

          {/* Notifications Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <List />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};
