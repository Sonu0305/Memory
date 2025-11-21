'use server';

import { createServerClient } from '@/lib/supabase';
import type { GameState, SavedGameState } from '@/lib/types';

/**
 * Save game state to database
 */
export async function saveGameState(userId: string, state: GameState): Promise<boolean> {
    try {
        const supabase = createServerClient();

        // Use upsert to insert or update
        const { error } = await supabase
            .from('game_states')
            .upsert(
                {
                    user_id: userId,
                    state: state,
                    updated_at: new Date().toISOString(),
                },
                {
                    onConflict: 'user_id',
                }
            );

        if (error) {
            console.error('Error saving game state:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Save game state error:', error);
        return false;
    }
}

/**
 * Load saved game state
 */
export async function loadGameState(userId: string): Promise<SavedGameState | null> {
    try {
        const supabase = createServerClient();

        const { data, error } = await supabase
            .from('game_states')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                // No saved game found
                return null;
            }
            console.error('Error loading game state:', error);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Load game state error:', error);
        return null;
    }
}

/**
 * Delete saved game state
 */
export async function deleteGameState(userId: string): Promise<boolean> {
    try {
        const supabase = createServerClient();

        const { error } = await supabase
            .from('game_states')
            .delete()
            .eq('user_id', userId);

        if (error) {
            console.error('Error deleting game state:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Delete game state error:', error);
        return false;
    }
}

/**
 * Check if user has a saved game
 */
export async function hasSavedGame(userId: string): Promise<boolean> {
    const savedGame = await loadGameState(userId);
    return savedGame !== null;
}
