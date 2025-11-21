// TypeScript type definitions for Memory Puzzle Game

export interface Profile {
    id: string;
    name: string;
    created_at: string;
    updated_at?: string;
}

export interface ImageMetadata {
    id: string;
    user_id: string;
    blob_url: string;
    blob_pathname?: string;
    created_at: string;
}

export interface Tile {
    id: string;
    imageUrl: string;
    isFlipped: boolean;
    isMatched: boolean;
    pairId: number; // Used to identify matching pairs
}

export interface GameState {
    userId: string;
    tiles: Tile[];
    matchedPairs: number;
    moves: number;
    gridSize: number; // 4 for 4x4, 6 for 6x6, etc.
    customImages: string[]; // Array of blob URLs
    startedAt: string;
    lastPlayed: string;
}

export interface SavedGameState {
    id: string;
    user_id: string;
    state: GameState;
    created_at: string;
    updated_at: string;
}

export interface UploadResponse {
    url: string;
    pathname: string;
    contentType: string;
}

export interface ApiError {
    error: string;
    details?: string;
}

export type GridSize = 4 | 6;

export interface GameConfig {
    gridSize: GridSize;
    imageUrls: string[];
}
