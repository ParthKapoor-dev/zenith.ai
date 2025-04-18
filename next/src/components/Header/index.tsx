"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IoMdPlanet } from "react-icons/io";
import {
    Menu, X, User, Bell, Briefcase, ChevronDown,
    LogOut, Settings, HelpCircle, FileText, Users,
    Brain
} from 'lucide-react';
import handleLogout from '@/actions/auth/logout';
import { mutate } from 'swr';
import UserProps from '@/types/user';
import { useUser } from '@/hooks/useUser';
import Image from 'next/image';
import { ThemeBtn } from '../theme';

export default function Navbar() {
    const [user, setUser] = useState<UserProps | null>(null);
    const router = useRouter();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [notifications] = useState([
        { id: 1, text: "New candidate application", time: "2m ago" },
        { id: 2, text: "Interview scheduled", time: "1h ago" },
    ]);

    const userRole = user?.role || null;
    const userInitials = user?.name
        ? user.name.split(' ').map((n: any) => n[0]).join('').toUpperCase()
        : '';

    useEffect(() => {
        const userData: UserProps | null = useUser();
        if (userData) setUser(userData);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    async function handleLogoutButton() {
        await handleLogout();
        location.reload();
    }

    const candidateNavItems = [
        {
            trigger: 'Jobs',
            icon: <Briefcase className="w-4 h-4 mr-2" />,
            content: [
                { title: 'Search Jobs', description: 'Find your next opportunity', href: '/jobs' },
                { title: 'Saved Jobs', description: 'View your bookmarked positions', href: '/saved-jobs' },
                { title: 'Applications', description: 'Track your applications', href: '/applications' },
            ]
        },
        {
            trigger: 'Career',
            icon: <FileText className="w-4 h-4 mr-2" />,
            content: [
                { title: 'Profile', description: 'Update your professional profile', href: '/profile' },
                { title: 'Resume Builder', description: 'Create and edit your resume', href: '/resume' },
                { title: 'Skills Assessment', description: 'Take skill tests', href: '/skills' },
            ]
        }
    ];

    const recruiterNavItems = [
        {
            trigger: 'Recruitment',
            icon: <Users className="w-4 h-4 mr-2" />,
            content: [
                { title: 'Job Postings', description: 'Manage your job listings', href: '/job-postings' },
                { title: 'Candidates', description: 'View applicant profiles', href: '/candidates' },
                { title: 'Talent Pool', description: 'Browse potential candidates', href: '/talent-pool' },
            ]
        },
        {
            trigger: 'Job Postings',
            icon: <Briefcase className="w-4 h-4 mr-2" />,
            content: [
                { title: 'Jobs Dashboard', description: 'View recruitment metrics', href: '/dashboard' },
                { title: 'New Posting +', description: 'Create a new Job posting', href: '/postings/forge' },
            ]
        }
    ];

    const currentNavItems = userRole === 'recruiter' ? recruiterNavItems : candidateNavItems;

    const renderNavigationContent = (items: any) => (
        <ul className="grid w-[400px] gap-3 p-4">
            {items.map((item: any, index: number) => (
                <li key={index}>
                    <NavigationMenuLink asChild>
                        <Link
                            href={item.href}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent dark:hover:bg-zinc-700 hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                            <div className="text-sm font-medium leading-none">{item.title}</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                {item.description}
                            </p>
                        </Link>
                    </NavigationMenuLink>
                </li>
            ))}
        </ul>
    );

    return (
        <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-purple-100/20 backdrop-blur-lg shadow-sm' : 'bg-transparent'}`}>
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/">
                        <motion.div
                            whileHover={{
                                rotate: [0, -10, 10, 0],
                                scale: 1.05
                            }}
                            transition={{
                                duration: 0.3,
                                type: "spring",
                                stiffness: 300
                            }}
                            className="flex items-center gap-2 cursor-pointer"
                        >
                            <Brain
                                className="w-8 h-8 text-[#1b132c] dark:text-[#d6eaf3]"
                            />
                            <span className="text-xl font-bold bg-gradient-to-r 
                from-[#1b132c] to-[#0d3647] 
                dark:from-[#d6eaf3] dark:to-[#1fa6b8] 
                bg-clip-text text-transparent">
                                Zenith AI
                            </span>
                        </motion.div>
                    </Link>

                    {!user ? (
                        // Non-authenticated navigation
                        <div className="flex items-center gap-4">
                            <ThemeBtn />
                            <Button
                                variant="ghost"
                                onClick={() => router.push('/about')}
                            >
                                About
                            </Button>
                            <Button
                                className="bg-gradient-to-r from-[#1b132c] to-[#0d3647] dark:from-purple-500 dark:to-purple-500/90 text-white"
                                onClick={() => router.push('/auth/login')}
                            >
                                Login
                            </Button>
                        </div>
                    ) : (
                        // Authenticated navigation
                        <div className="hidden md:flex items-center gap-6">
                            <ThemeBtn />
                            <NavigationMenu>
                                <NavigationMenuList>
                                    {currentNavItems.map((item, index) => (
                                        <NavigationMenuItem key={index}>
                                            <NavigationMenuTrigger className='border shadow-sm '>
                                                {item.icon}
                                                {item.trigger}
                                            </NavigationMenuTrigger>
                                            <NavigationMenuContent className='dark:bg-purple-100/10'>
                                                {renderNavigationContent(item.content)}
                                            </NavigationMenuContent>
                                        </NavigationMenuItem>
                                    ))}
                                </NavigationMenuList>
                            </NavigationMenu>

                            {/* Notifications */}
                            <DropdownMenu>
                                    <DropdownMenuTrigger asChild className='border shadow-sm'>
                                    <Button variant="ghost" size="icon" className="relative">
                                        <Bell className="h-5 w-5" />
                                        <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-80">
                                    <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {notifications.map((notification) => (
                                        <DropdownMenuItem key={notification.id} className="flex flex-col items-start py-2">
                                            <p className="text-sm font-medium">{notification.text}</p>
                                            <p className="text-xs text-gray-500">{notification.time}</p>
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* User Menu */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#1b132c] to-[#0d3647] dark:from-[#d6eaf3] dark:to-[#1fa6b8] flex items-center justify-center overflow-hidden">
                                            {user.image ? (
                                                <Image src={user.image} alt=''
                                                    width={40}
                                                    height={40} />
                                            ) : (
                                                <span className="text-white text-sm font-medium">
                                                    {userInitials}
                                                </span>
                                            )}
                                        </div>
                                        <ChevronDown className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuLabel>
                                        {user.name}
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => router.push('/profile')}>
                                        <User className="mr-2 h-4 w-4" />
                                        <span>Profile</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => router.push('/settings')}>
                                        <Settings className="mr-2 h-4 w-4" />
                                        <span>Settings</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => router.push('/help')}>
                                        <HelpCircle className="mr-2 h-4 w-4" />
                                        <span>Help Center</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        className="text-red-600"
                                        onClick={handleLogoutButton}
                                    >
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Log out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    )}

                    {/* Mobile Menu Button */}
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden"
                    >
                        {isMobileMenuOpen ? (
                            <X className="h-6 w-6" />
                        ) : (
                            <Menu className="h-6 w-6" />
                        )}
                    </motion.button>
                </div>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-background border-t"
                    >
                        <div className="px-4 pt-2 pb-3 space-y-1">
                            {!user ? (
                                <>
                                    <a href="/about" className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-accent">About</a>
                                    <a href="/login" className="block px-3 py-2 rounded-md text-base font-medium text-[#1b132c] dark:text-[#d6eaf3] hover:bg-accent">Login</a>
                                </>
                            ) : (
                                <>
                                    {currentNavItems.map(category =>
                                        category.content.map((item, index) => (
                                            <a
                                                key={index}
                                                href={item.href}
                                                className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-accent"
                                            >
                                                {item.title}
                                            </a>
                                        ))
                                    )}
                                    <a href="/settings" className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-accent">Settings</a>
                                    <a href="/help" className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-accent">Help Center</a>
                                    <button
                                        onClick={handleLogoutButton}
                                        className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-accent"
                                    >
                                        Log out
                                    </button>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}