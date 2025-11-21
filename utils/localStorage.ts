/**
 * Local storage utilities for managing user ID
 * SSR-safe implementation
 */

const USER_ID_KEY = 'memory_puzzle_user_id';

/**
 * Get user ID from localStorage
 */
export function getUserId(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(USER_ID_KEY);
}

/**
 * Set user ID in localStorage
 */
export function setUserId(userId: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(USER_ID_KEY, userId);
}

/**
 * Remove user ID from localStorage
 */
export function clearUserId(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(USER_ID_KEY);
}

/**
 * Check if user ID exists in localStorage
 */
export function hasUserId(): boolean {
    return getUserId() !== null;
}
