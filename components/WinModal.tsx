'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface WinModalProps {
    moves: number;
    userId: string;
    onClose: () => void;
    onPlayAgain: () => void;
}

export default function WinModal({ moves, userId, onClose, onPlayAgain }: WinModalProps) {
    const router = useRouter();

    const handlePlayAgain = () => {
        onPlayAgain();
        onClose();
    };

    const confettiColors = ['#0ea5e9', '#d946ef', '#22c55e', '#f59e0b', '#ec4899'];
    const confettiPieces = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        color: confettiColors[i % confettiColors.length],
        x: Math.random() * 100,
        delay: Math.random() * 0.5,
    }));

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                {/* Confetti */}
                {confettiPieces.map((piece) => (
                    <motion.div
                        key={piece.id}
                        className="absolute w-3 h-3 rounded-full"
                        style={{
                            backgroundColor: piece.color,
                            left: `${piece.x}%`,
                            top: '-5%',
                        }}
                        animate={{
                            y: ['0vh', '110vh'],
                            rotate: [0, 720],
                            opacity: [1, 0],
                        }}
                        transition={{
                            duration: 3,
                            delay: piece.delay,
                            ease: 'easeIn',
                        }}
                    />
                ))}

                {/* Modal */}
                <motion.div
                    className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-8 sm:p-12 border border-white/20 shadow-glass max-w-md w-full mx-4"
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 10 }}
                    transition={{ type: 'spring', duration: 0.5 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Trophy Icon */}
                    <motion.div
                        className="mx-auto w-24 h-24 mb-6"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1, rotate: [0, -10, 10, -10, 0] }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                    >
                        <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-6xl shadow-glow">
                            🏆
                        </div>
                    </motion.div>

                    {/* Title */}
                    <motion.h2
                        className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        Congratulations!
                    </motion.h2>

                    {/* Message */}
                    <motion.p
                        className="text-white/80 text-center mb-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        You completed the puzzle!
                    </motion.p>

                    <motion.p
                        className="text-white/60 text-center mb-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        Total moves: <span className="font-bold text-white">{moves}</span>
                    </motion.p>

                    {/* Buttons */}
                    <motion.div
                        className="flex gap-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        <button
                            onClick={() => router.push('/')}
                            className="flex-1 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-glow hover:shadow-glow hover:scale-105"
                        >
                            Home
                        </button>
                        <button
                            onClick={handlePlayAgain}
                            className="flex-1 bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-glow-accent hover:shadow-glow-accent hover:scale-105"
                        >
                            Play Again
                        </button>
                    </motion.div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
