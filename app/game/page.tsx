'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import GameBoard from '@/components/GameBoard';
import GameControls from '@/components/GameControls';
import PlayerProfile from '@/components/PlayerProfile';
import { getUserId } from '@/utils/localStorage';
import { getProfile } from '@/actions/profile';
import { loadGameState } from '@/actions/gameState';
import { getUserImages } from '@/actions/images';
import { initializeGame, getRequiredImageCount } from '@/lib/gameLogic';
import type { Profile, GameState, GridSize } from '@/lib/types';

// Default images (you can replace these with actual hosted images)
const DEFAULT_IMAGES = [
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1472491235688-bdc81a63246e?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1573865526739-10c1dd7228d3?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1501820488136-72669149e0d4?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1462953491269-9aff00919695?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1501820488136-72669149e0d4?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1598133894008-61f7fdb8cc3a?w=400&h=400&fit=crop',
];

export default function GamePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [gameState, setGameState] = useState<GameState | null>(null);
    const [gridSize, setGridSize] = useState<GridSize>(4);

    useEffect(() => {
        const initializePage = async () => {
            const userId = getUserId();

            if (!userId) {
                router.push('/');
                return;
            }

            // Get user profile
            const userProfile = await getProfile(userId);
            if (!userProfile) {
                router.push('/');
                return;
            }
            setProfile(userProfile);

            // Try to load saved game
            const savedGame = await loadGameState(userId);

            if (savedGame) {
                setGameState(savedGame.state);
                setGridSize(savedGame.state.gridSize);
            } else {
                // Start new game
                const userImages = await getUserImages(userId);
                const imageUrls = userImages.length >= 8
                    ? userImages.map(img => img.blob_url)
                    : DEFAULT_IMAGES;

                const newGame = initializeGame(userId, imageUrls, gridSize);
                setGameState(newGame);
            }

            setLoading(false);
        };

        initializePage();
    }, [router, gridSize]);

    const handleGridSizeChange = async (newSize: GridSize) => {
        if (confirm('Changing grid size will start a new game. Continue?')) {
            const userId = getUserId();
            if (!userId) return;

            setGridSize(newSize);

            const userImages = await getUserImages(userId);
            const imageUrls = userImages.length >= getRequiredImageCount(newSize)
                ? userImages.map(img => img.blob_url)
                : DEFAULT_IMAGES;

            const newGame = initializeGame(userId, imageUrls, newSize);
            setGameState(newGame);
        }
    };

    if (loading || !gameState || !profile) {
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
        <div className="min-h-screen p-4 sm:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <PlayerProfile profile={profile} />

                    {/* Grid Size Selector */}
                    <div className="flex gap-2 bg-white/5 backdrop-blur-md rounded-xl p-2 border border-white/10">
                        <button
                            onClick={() => handleGridSizeChange(4)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${gridSize === 4
                                    ? 'bg-primary-500 text-white shadow-glow'
                                    : 'text-white/60 hover:text-white hover:bg-white/10'
                                }`}
                        >
                            4×4
                        </button>
                        <button
                            onClick={() => handleGridSizeChange(6)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${gridSize === 6
                                    ? 'bg-primary-500 text-white shadow-glow'
                                    : 'text-white/60 hover:text-white hover:bg-white/10'
                                }`}
                        >
                            6×6
                        </button>
                    </div>
                </motion.div>

                {/* Game Board */}
                <GameBoard initialGameState={gameState} />

                {/* Controls */}
                <div className="mt-8">
                    <GameControls userId={profile.id} />
                </div>
            </div>
        </div>
    );
}
