'use client';

import { motion } from 'framer-motion';
import type { Tile } from '@/lib/types';

interface GameTileProps {
    tile: Tile;
    onClick: (tile: Tile) => void;
    disabled: boolean;
}

export default function GameTile({ tile, onClick, disabled }: GameTileProps) {
    const handleClick = () => {
        if (!disabled && !tile.isFlipped && !tile.isMatched) {
            onClick(tile);
        }
    };

    return (
        <motion.div
            className="relative aspect-square cursor-pointer perspective-1000"
            onClick={handleClick}
            whileHover={!tile.isFlipped && !tile.isMatched ? { scale: 1.05 } : {}}
            whileTap={!tile.isFlipped && !tile.isMatched ? { scale: 0.95 } : {}}
        >
            <motion.div
                className="relative w-full h-full"
                initial={false}
                animate={{ rotateY: tile.isFlipped || tile.isMatched ? 180 : 0 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
                style={{ transformStyle: 'preserve-3d' }}
            >
                {/* Back of card (visible when not flipped) */}
                <div
                    className="absolute inset-0 backface-hidden rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 shadow-glass border border-white/20"
                    style={{ backfaceVisibility: 'hidden' }}
                >
                    <div className="w-full h-full flex items-center justify-center">
                        <motion.div
                            className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                    </div>
                </div>

                {/* Front of card (visible when flipped) */}
                <div
                    className={`absolute inset-0 backface-hidden rounded-xl overflow-hidden shadow-glass border-2 ${tile.isMatched ? 'border-green-400' : 'border-white/20'
                        }`}
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                    <img
                        src={tile.imageUrl}
                        alt="Memory card"
                        className={`w-full h-full object-cover ${tile.isMatched ? 'opacity-60' : ''
                            }`}
                    />
                    {tile.isMatched && (
                        <motion.div
                            className="absolute inset-0 bg-green-400/20 backdrop-blur-sm flex items-center justify-center"
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <motion.svg
                                className="w-16 h-16 text-green-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                <motion.path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={3}
                                    d="M5 13l4 4L19 7"
                                />
                            </motion.svg>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}
