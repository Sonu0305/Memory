import { v4 as uuidv4 } from 'uuid';
import type { Tile, GameState, GridSize } from './types';

/**
 * Shuffle an array using Fisher-Yates algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * Create pairs of tiles from image URLs
 */
export function createTilePairs(imageUrls: string[]): Tile[] {
    const pairs: Tile[] = [];

    imageUrls.forEach((url, index) => {
        // Create two tiles for each image (a pair)
        pairs.push({
            id: uuidv4(),
            imageUrl: url,
            isFlipped: false,
            isMatched: false,
            pairId: index,
        });
        pairs.push({
            id: uuidv4(),
            imageUrl: url,
            isFlipped: false,
            isMatched: false,
            pairId: index,
        });
    });

    // Shuffle the pairs
    return shuffleArray(pairs);
}

/**
 * Initialize a new game state
 */
export function initializeGame(
    userId: string,
    imageUrls: string[],
    gridSize: GridSize
): GameState {
    const requiredImages = (gridSize * gridSize) / 2;
    const selectedImages = imageUrls.slice(0, requiredImages);

    return {
        userId,
        tiles: createTilePairs(selectedImages),
        matchedPairs: 0,
        moves: 0,
        gridSize,
        customImages: imageUrls,
        startedAt: new Date().toISOString(),
        lastPlayed: new Date().toISOString(),
    };
}

/**
 * Check if two tiles match
 */
export function tilesMatch(tile1: Tile, tile2: Tile): boolean {
    return tile1.pairId === tile2.pairId && tile1.id !== tile2.id;
}

/**
 * Check if the game is won
 */
export function isGameWon(tiles: Tile[]): boolean {
    return tiles.every(tile => tile.isMatched);
}

/**
 * Calculate required number of images for a grid size
 */
export function getRequiredImageCount(gridSize: GridSize): number {
    return (gridSize * gridSize) / 2;
}

/**
 * Validate grid size
 */
export function isValidGridSize(size: number): size is GridSize {
    return size === 4 || size === 6;
}

/**
 * Get default grid size based on number of available images
 */
export function getDefaultGridSize(imageCount: number): GridSize {
    if (imageCount >= 18) return 6; // 6x6 needs 18 images
    return 4; // 4x4 needs 8 images
}
