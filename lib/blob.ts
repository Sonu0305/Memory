import { put, del } from '@vercel/blob';
import type { UploadResponse } from './types';

/**
 * Upload a file to Vercel Blob Storage
 * @param file - The file to upload
 * @param pathname - Optional pathname for the blob
 * @returns Upload response with URL and metadata
 */
export async function uploadToBlob(
    file: File,
    pathname?: string
): Promise<UploadResponse> {
    try {
        const filename = pathname || `${Date.now()}-${file.name}`;

        const blob = await put(filename, file, {
            access: 'public',
            token: process.env.BLOB_READ_WRITE_TOKEN,
        });

        return {
            url: blob.url,
            pathname: blob.pathname,
            contentType: blob.contentType || file.type,
        };
    } catch (error) {
        console.error('Blob upload error:', error);
        throw new Error('Failed to upload image to storage');
    }
}

/**
 * Delete a file from Vercel Blob Storage
 * @param url - The blob URL to delete
 */
export async function deleteFromBlob(url: string): Promise<void> {
    try {
        await del(url, {
            token: process.env.BLOB_READ_WRITE_TOKEN,
        });
    } catch (error) {
        console.error('Blob deletion error:', error);
        throw new Error('Failed to delete image from storage');
    }
}

/**
 * Delete multiple files from Vercel Blob Storage
 * @param urls - Array of blob URLs to delete
 */
export async function deleteManyFromBlob(urls: string[]): Promise<void> {
    try {
        await Promise.all(urls.map(url => deleteFromBlob(url)));
    } catch (error) {
        console.error('Blob batch deletion error:', error);
        throw new Error('Failed to delete images from storage');
    }
}
