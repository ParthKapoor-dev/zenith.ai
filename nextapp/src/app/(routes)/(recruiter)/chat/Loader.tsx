import { motion } from 'framer-motion';
import { IoMdPlanet } from 'react-icons/io';

interface LoaderProps {
    loadingText?: string;
    variant?: 'default' | 'fullscreen';
}

export default function Loader({
    loadingText = 'Loading Dashboard',
    variant = 'default'
}: LoaderProps) {
    const containerClasses = 'fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-50 to-red-50 gap-5'
    // : 'w-full flex items-center justify-center';

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={containerClasses}
        >
            <div className="text-center">

                <motion.div
                    animate={{
                        rotate: 360,
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="bg-white rounded-full p-2 shadow-sm w-fit mx-auto mb-8"
                >
                    <IoMdPlanet className="w-16 h-16 text-purple-600 " />
                </motion.div>

                <div className="flex justify-center items-center space-x-2">
                    {[1, 2, 3].map((dot) => (
                        <motion.div
                            key={dot}
                            initial={{ opacity: 0.3 }}
                            animate={{
                                opacity: [0.3, 1, 0.3],
                            }}
                            transition={{
                                duration: 1.5,
                                delay: dot * 0.2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="w-3 h-3 bg-blue-600 rounded-full"
                        />
                    ))}
                </div>

                <p className="mt-4 text-gray-700 text-lg font-medium">
                    {loadingText}
                </p>
            </div>
        </motion.div>
    );
};
