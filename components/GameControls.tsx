'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

interface GameControlsProps {
    userId: string;
    onRestart: () => void;
}

export default function GameControls({ userId, onRestart }: GameControlsProps) {
    const router = useRouter();

    const handleRestart = () => {
        onRestart();
    };

    const handleBackHome = () => {
        router.push('/');
    };

    const handleUploadImages = () => {
        router.push('/upload');
    };

    return (
        <motion.div
            className="flex flex-wrap gap-3 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
        >
            <button
                onClick={handleBackHome}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-semibold rounded-xl transition-all duration-200 border border-white/20 hover:scale-105"
            >
                🏠 Home
            </button>

            <button
                onClick={handleUploadImages}
                className="px-6 py-3 bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-glow-accent hover:scale-105"
            >
                📷 Custom Images
            </button>

            <button
                onClick={handleRestart}
                className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-glow hover:scale-105"
            >
                🔄 Restart
            </button>
        </motion.div>
    );
}
