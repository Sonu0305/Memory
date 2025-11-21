'use server';

import { createServerClient } from '@/lib/supabase';
import { deleteFromBlob } from '@/lib/blob';
import type { ImageMetadata } from '@/lib/types';

/**
 * Save image metadata to database
 */
export async function saveImageMetadata(
    userId: string,
    blobUrl: string,
    blobPathname?: string
): Promise<ImageMetadata | null> {
    try {
        const supabase = createServerClient();

        const { data, error } = await supabase
            .from('images')
            .insert({
                user_id: userId,
                blob_url: blobUrl,
                blob_pathname: blobPathname,
            })
            .select()
            .single();

        if (error) {
            console.error('Error saving image metadata:', error);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Save image metadata error:', error);
        return null;
    }
}

/**
 * Get all images for a user
 */
export async function getUserImages(userId: string): Promise<ImageMetadata[]> {
    try {
        const supabase = createServerClient();

        const { data, error } = await supabase
            .from('images')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching user images:', error);
            return [];
        }

        return data || [];
    } catch (error) {
        console.error('Get user images error:', error);
        return [];
    }
}

/**
 * Delete an image (both from blob storage and database)
 */
export async function deleteImage(imageId: string, blobUrl: string): Promise<boolean> {
    try {
        const supabase = createServerClient();

        // Delete from blob storage first
        try {
            await deleteFromBlob(blobUrl);
        } catch (blobError) {
            console.error('Error deleting from blob, continuing with DB deletion:', blobError);
            // Continue with database deletion even if blob deletion fails
        }

        // Delete from database
        const { error } = await supabase
            .from('images')
            .delete()
            .eq('id', imageId);

        if (error) {
            console.error('Error deleting image from database:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Delete image error:', error);
        return false;
    }
}

/**
 * Delete all images for a user
 */
export async function deleteAllUserImages(userId: string): Promise<boolean> {
    try {
        const images = await getUserImages(userId);

        // Delete all images
        const deletePromises = images.map(img => deleteImage(img.id, img.blob_url));
        await Promise.all(deletePromises);

        return true;
    } catch (error) {
        console.error('Delete all user images error:', error);
        return false;
    }
}

/**
 * Get image count for a user
 */
export async function getUserImageCount(userId: string): Promise<number> {
    try {
        const supabase = createServerClient();

        const { count, error } = await supabase
            .from('images')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId);

        if (error) {
            console.error('Error counting user images:', error);
            return 0;
        }

        return count || 0;
    } catch (error) {
        console.error('Get user image count error:', error);
        return 0;
    }
}
