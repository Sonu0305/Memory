'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import { getUserId, setUserId } from '@/utils/localStorage';
import { getOrCreateProfile, getProfileByName } from '@/actions/profile';
import { hasSavedGame, deleteGameState } from '@/actions/gameState';

export default function HomePage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(true);
    const [hasExistingGame, setHasExistingGame] = useState(false);
    const [existingUserId, setExistingUserId] = useState<string | null>(null);

    useEffect(() => {
        const checkExistingUser = async () => {
            const userId = getUserId();
            if (userId) {
                setExistingUserId(userId);
                const savedGame = await hasSavedGame(userId);
                setHasExistingGame(savedGame);

                // Get user profile to show name
                const profile = await getOrCreateProfile(userId);
                if (profile) {
                    setName(profile.name);
                }
            }
            setLoading(false);
        };

        checkExistingUser();
    }, []);

    const handleStartGame = async () => {
        if (!name.trim()) {
            alert('Please enter your name');
            return;
        }

        // First, try to find existing user by name
        const existingProfile = await getProfileByName(name.trim());

        let userId: string;
        if (existingProfile) {
            // User exists, use their ID
            userId = existingProfile.id;
        } else {
            // New user, create new ID
            userId = uuidv4();
            await getOrCreateProfile(userId, name.trim());
        }

        // Save userId to localStorage
        setUserId(userId);

        // Navigate to game
        router.push('/game');
    };

    const handleContinueGame = () => {
        router.push('/game');
    };

    const handleNewGame = async () => {
        if (existingUserId) {
            await deleteGameState(existingUserId);
            setHasExistingGame(false);
            router.push('/game');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <motion.div
                    className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="max-w-2xl w-full">
                {/* Hero Section */}
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <motion.h1
                        className="text-6xl sm:text-7xl font-bold mb-4 bg-gradient-to-r from-primary-400 via-accent-400 to-primary-400 bg-clip-text text-transparent"
                        animate={{ backgroundPosition: ['0%', '100%', '0%'] }}
                        transition={{ duration: 5, repeat: Infinity }}
                    >
                        Memory Puzzle
                    </motion.h1>
                    <motion.p
                        className="text-xl text-white/80"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        Test your memory with beautiful custom images
                    </motion.p>
                </motion.div>

                {/* Main Card */}
                <motion.div
                    className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 sm:p-12 border border-white/10 shadow-glass"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    {existingUserId && hasExistingGame ? (
                        /* Continue Game UI */
                        <div className="space-y-6">
                            <div className="text-center">
                                <h2 className="text-2xl font-bold text-white mb-2">
                                    Welcome back, {name}!
                                </h2>
                                <p className="text-white/60">You have a saved game</p>
                            </div>

                            <div className="flex flex-col gap-3">
                                <motion.button
                                    onClick={handleContinueGame}
                                    className="w-full py-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-glow"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Continue Game
                                </motion.button>

                                <motion.button
                                    onClick={handleNewGame}
                                    className="w-full py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all duration-200 border border-white/20"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Start New Game
                                </motion.button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="text-center">
                                <h2 className="text-2xl font-bold text-white mb-2">
                                    {name ? `Welcome back, ${name}!` : 'Welcome!'}
                                </h2>
                                <p className="text-white/60">
                                    {name ? 'Ready to play?' : 'Enter your name to start'}
                                </p>
                            </div>

                            {!name && (
                                <div>
                                    <label htmlFor="name" className="block text-white/80 mb-2 font-medium">
                                        Your Name
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleStartGame()}
                                        placeholder="Enter your name"
                                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        autoFocus
                                    />
                                </div>
                            )}

                            <motion.button
                                onClick={handleStartGame}
                                disabled={!name.trim()}
                                className="w-full py-4 bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white font-semibold rounded-xl transition-all duration-200 shadow-glow disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                whileHover={{ scale: name.trim() ? 1.02 : 1 }}
                                whileTap={{ scale: name.trim() ? 0.98 : 1 }}
                            >
                                Start Game
                            </motion.button>

                            <div className="text-center">
                                <button
                                    onClick={() => router.push('/upload')}
                                    className="text-white/60 hover:text-white transition-colors text-sm"
                                >
                                    Upload custom images →
                                </button>
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Features */}
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    {[
                        { icon: '🎨', title: 'Custom Images', desc: 'Upload your own' },
                        { icon: '💾', title: 'Auto Save', desc: 'Resume anytime' },
                        { icon: '🏆', title: 'Track Progress', desc: 'See your moves' },
                    ].map((feature, i) => (
                        <motion.div
                            key={i}
                            className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 text-center"
                            whileHover={{ scale: 1.05, y: -5 }}
                        >
                            <div className="text-3xl mb-2">{feature.icon}</div>
                            <div className="font-semibold text-white mb-1">{feature.title}</div>
                            <div className="text-sm text-white/60">{feature.desc}</div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
