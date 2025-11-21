'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import GameTile from './GameTile';
import WinModal from './WinModal';
import { tilesMatch, isGameWon } from '@/lib/gameLogic';
import { saveGameState } from '@/actions/gameState';
import type { Tile, GameState } from '@/lib/types';

interface GameBoardProps {
    initialGameState: GameState;
    onGameComplete?: () => void;
}

export default function GameBoard({ initialGameState, onGameComplete }: GameBoardProps) {
    const [gameState, setGameState] = useState<GameState>(initialGameState);
    const [flippedTiles, setFlippedTiles] = useState<Tile[]>([]);
    const [isChecking, setIsChecking] = useState(false);
    const [showWinModal, setShowWinModal] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Auto-save game state
    useEffect(() => {
        const saveGame = async () => {
            setIsSaving(true);
            await saveGameState(gameState.userId, gameState);
            setIsSaving(false);
        };

        // Debounce auto-save
        const timer = setTimeout(() => {
            saveGame();
        }, 1000);

        return () => clearTimeout(timer);
    }, [gameState]);

    // Check for win condition
    useEffect(() => {
        if (isGameWon(gameState.tiles)) {
            setTimeout(() => {
                setShowWinModal(true);
                onGameComplete?.();
            }, 500);
        }
    }, [gameState.tiles, onGameComplete]);

    const handleTileClick = (clickedTile: Tile) => {
        if (isChecking || flippedTiles.length >= 2) return;

        // Flip the tile
        const updatedTiles = gameState.tiles.map(tile =>
            tile.id === clickedTile.id ? { ...tile, isFlipped: true } : tile
        );

        setGameState(prev => ({
            ...prev,
            tiles: updatedTiles,
            moves: prev.moves + 1,
            lastPlayed: new Date().toISOString(),
        }));

        const newFlippedTiles = [...flippedTiles, clickedTile];
        setFlippedTiles(newFlippedTiles);

        // Check for match when two tiles are flipped
        if (newFlippedTiles.length === 2) {
            setIsChecking(true);

            const [first, second] = newFlippedTiles;
            const isMatch = tilesMatch(first, second);

            if (isMatch) {
                // Match found - mark as matched
                setTimeout(() => {
                    setGameState(prev => ({
                        ...prev,
                        tiles: prev.tiles.map(tile =>
                            tile.pairId === first.pairId
                                ? { ...tile, isMatched: true }
                                : tile
                        ),
                        matchedPairs: prev.matchedPairs + 1,
                    }));
                    setFlippedTiles([]);
                    setIsChecking(false);
                }, 600);
            } else {
                // No match - flip back
                setTimeout(() => {
                    setGameState(prev => ({
                        ...prev,
                        tiles: prev.tiles.map(tile =>
                            tile.id === first.id || tile.id === second.id
                                ? { ...tile, isFlipped: false }
                                : tile
                        ),
                    }));
                    setFlippedTiles([]);
                    setIsChecking(false);
                }, 1000);
            }
        }
    };

    const gridCols = gameState.gridSize === 4 ? 'grid-cols-4' : 'grid-cols-6';

    return (
        <>
            <div className="w-full max-w-4xl mx-auto">
                {/* Stats */}
                <motion.div
                    className="mb-6 flex justify-between items-center bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="text-center">
                        <div className="text-sm text-white/60">Moves</div>
                        <div className="text-2xl font-bold text-white">{gameState.moves}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-sm text-white/60">Matched</div>
                        <div className="text-2xl font-bold text-white">
                            {gameState.matchedPairs}/{(gameState.gridSize * gameState.gridSize) / 2}
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-sm text-white/60">Status</div>
                        <div className="text-sm font-medium text-white">
                            {isSaving ? (
                                <span className="text-yellow-400">Saving...</span>
                            ) : (
                                <span className="text-green-400">Saved ✓</span>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Game Grid */}
                <motion.div
                    className={`grid ${gridCols} gap-3 sm:gap-4`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    {gameState.tiles.map((tile) => (
                        <GameTile
                            key={tile.id}
                            tile={tile}
                            onClick={handleTileClick}
                            disabled={isChecking}
                        />
                    ))}
                </motion.div>
            </div>

            {/* Win Modal */}
            {showWinModal && (
                <WinModal
                    moves={gameState.moves}
                    userId={gameState.userId}
                    onClose={() => setShowWinModal(false)}
                />
            )}
        </>
    );
}
