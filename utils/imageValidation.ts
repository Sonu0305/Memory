/**
 * Image validation utilities
 */

export interface ImageValidationResult {
    valid: boolean;
    error?: string;
}

/**
 * Validate that an image has a 1:1 aspect ratio (square)
 */
export function validateImageAspectRatio(file: File): Promise<ImageValidationResult> {
    return new Promise((resolve) => {
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(url);

            const ratio = img.width / img.height;
            const isSquare = Math.abs(ratio - 1) < 0.01; // Allow 1% tolerance

            if (!isSquare) {
                resolve({
                    valid: false,
                    error: `Image must be square (1:1 ratio). Current ratio: ${img.width}x${img.height}`,
                });
            } else {
                resolve({ valid: true });
            }
        };

        img.onerror = () => {
            URL.revokeObjectURL(url);
            resolve({
                valid: false,
                error: 'Failed to load image',
            });
        };

        img.src = url;
    });
}

/**
 * Validate file size (max 5MB)
 */
export function validateFileSize(file: File, maxSizeMB: number = 5): ImageValidationResult {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    if (file.size > maxSizeBytes) {
        return {
            valid: false,
            error: `File size must be less than ${maxSizeMB}MB. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`,
        };
    }

    return { valid: true };
}

/**
 * Validate file type (must be image)
 */
export function validateFileType(file: File): ImageValidationResult {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

    if (!validTypes.includes(file.type)) {
        return {
            valid: false,
            error: `File must be an image (JPEG, PNG, GIF, or WebP). Current type: ${file.type}`,
        };
    }

    return { valid: true };
}

/**
 * Comprehensive image validation
 */
export async function validateImage(file: File): Promise<ImageValidationResult> {
    // Check file type
    const typeValidation = validateFileType(file);
    if (!typeValidation.valid) return typeValidation;

    // Check file size
    const sizeValidation = validateFileSize(file);
    if (!sizeValidation.valid) return sizeValidation;

    // Check aspect ratio
    const aspectValidation = await validateImageAspectRatio(file);
    if (!aspectValidation.valid) return aspectValidation;

    return { valid: true };
}

/**
 * Create a preview URL for an image file
 */
export function createImagePreview(file: File): string {
    return URL.createObjectURL(file);
}

/**
 * Revoke a preview URL
 */
export function revokeImagePreview(url: string): void {
    URL.revokeObjectURL(url);
}
