"use client"

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Briefcase, User, Globe, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { FaGoogle } from "react-icons/fa";
import { IoMdPlanet } from "react-icons/io";
import { toast } from '@/hooks/use-toast';
import handleGoogleLogin from '@/actions/auth/login';
import { UserRole } from '@/types/user';

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('candidate');

  const handleLogin = async (role: UserRole) => {
    setIsLoading(true);
    try {

      await handleGoogleLogin(role);

    } catch (error: any) {
      
      console.log(error);

      toast({
        variant: 'destructive',
        title: error?.message
      })
    } finally {
      setIsLoading(false);
    }
  };

  const backgroundPatterns = {
    initial: { opacity: 0 },
    animate: {
      opacity: 0.5,
      transition: { duration: 1 }
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-50 via-fuchsia-50 to-violet-50 flex items-center justify-center p-4">
      {/* Animated background patterns */}
      <motion.div
        className="absolute inset-0 z-0"
        initial="initial"
        animate="animate"
        variants={backgroundPatterns}
      >
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute top-40 right-20 w-72 h-72 bg-rose-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute bottom-40 left-1/2 w-72 h-72 bg-violet-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg relative z-10"
      >
        <Card className="backdrop-blur-xl bg-white/80 shadow-2xl border-0 overflow-hidden">
          {/* Hero Section */}
          <CardContent className="pt-16 pb-8 px-8 ">

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-center mb-8"
            >

              <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-4">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className=" bg-white rounded-full p-2 shadow-lg"
                >
                  <IoMdPlanet className="w-8 h-8 text-purple-600" />
                </motion.div>
                <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                  JobverseAI
                </span>
              </h1>
              <p className="text-slate-600">Revolutionizing recruitment with AI</p>
            </motion.div>

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full h-full grid-cols-2 mb-8">
                <TabsTrigger
                  value="candidate"
                  className="flex items-center gap-2 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-50 data-[state=active]:to-fuchsia-50"
                >
                  <User className="w-4 h-4" />
                  <span>Job Seeker</span>
                </TabsTrigger>
                <TabsTrigger
                  value="recruiter"
                  className="flex items-center gap-2 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-50 data-[state=active]:to-fuchsia-50"
                >
                  <Briefcase className="w-4 h-4" />
                  <span>Recruiter</span>
                </TabsTrigger>
              </TabsList>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <TabsContent value="candidate" className="mt-0 space-y-6">
                    <div className="bg-violet-50 rounded-lg p-4 flex items-start space-x-3">
                      <Sparkles className="w-5 h-5 text-violet-600 mt-1 flex-shrink-0" />
                      <p className="text-sm text-violet-700">
                        Get matched with your dream job using our advanced AI algorithms. Join thousands of successful professionals.
                      </p>
                    </div>
                    <Button
                      onClick={() => handleLogin('candidate')}
                      disabled={isLoading}
                      className="w-full h-12 bg-white hover:bg-gray-50 text-slate-800 border shadow-sm relative overflow-hidden group"
                    >
                      <div className="flex items-center justify-center">
                        {isLoading ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <div className='flex gap-2 items-center'>
                            <FaGoogle />
                            <span>Continue with Google</span>
                            <ArrowRight className="w-4 h-4 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                          </div>
                        )}
                      </div>
                    </Button>
                  </TabsContent>

                  <TabsContent value="recruiter" className="mt-0 space-y-6">
                    <div className="bg-fuchsia-50 rounded-lg p-4 flex items-start space-x-3">
                      <Sparkles className="w-5 h-5 text-fuchsia-600 mt-1 flex-shrink-0" />
                      <p className="text-sm text-fuchsia-700">
                        Access our AI-powered platform to find the perfect candidates. Save time and resources with intelligent matching.
                      </p>
                    </div>
                    <Button
                      onClick={() => handleLogin('recruiter')}
                      disabled={isLoading}
                      className="w-full h-12 bg-white hover:bg-gray-50 text-slate-800 border shadow-sm relative overflow-hidden group"
                    >
                      <div className="flex items-center justify-center">
                        {isLoading ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <div className='flex gap-2 items-center'>
                            <FaGoogle />
                            <span>Continue with Google</span>
                            <ArrowRight className="w-4 h-4 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                          </div>
                        )}
                      </div>
                    </Button>
                  </TabsContent>
                </motion.div>
              </AnimatePresence>
            </Tabs>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-8 text-center space-y-4"
            >
              <p className="text-sm text-slate-500">
                By continuing, you agree to JobverseAI's{' '}
                <a href="#" className="text-purple-600 hover:text-purple-700 hover:underline">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-purple-600 hover:text-purple-700 hover:underline">Privacy Policy</a>
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginPage;