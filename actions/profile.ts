'use server';

import { createServerClient } from '@/lib/supabase';
import type { Profile } from '@/lib/types';

/**
 * Create a new user profile
 */
export async function createProfile(id: string, name: string): Promise<Profile | null> {
    try {
        const supabase = createServerClient();

        const { data, error } = await supabase
            .from('profiles')
            .insert({ id, name })
            .select()
            .single();

        if (error) {
            console.error('Error creating profile:', error);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Create profile error:', error);
        return null;
    }
}

/**
 * Get a profile by ID
 */
export async function getProfile(id: string): Promise<Profile | null> {
    try {
        const supabase = createServerClient();

        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                // Profile not found
                return null;
            }
            console.error('Error fetching profile:', error);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Get profile error:', error);
        return null;
    }
}

/**
 * Update a profile's name
 */
export async function updateProfileName(id: string, name: string): Promise<boolean> {
    try {
        const supabase = createServerClient();

        const { error } = await supabase
            .from('profiles')
            .update({ name })
            .eq('id', id);

        if (error) {
            console.error('Error updating profile:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Update profile error:', error);
        return false;
    }
}

/**
 * Get or create a profile (helper function)
 */
export async function getOrCreateProfile(id: string, name?: string): Promise<Profile | null> {
    let profile = await getProfile(id);

    if (!profile && name) {
        profile = await createProfile(id, name);
    }

    return profile;
}
