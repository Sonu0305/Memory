'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import ImageUploader from '@/components/ImageUploader';
import { getUserId } from '@/utils/localStorage';
import { getUserImages, deleteImage } from '@/actions/images';
import type { ImageMetadata } from '@/lib/types';

export default function UploadPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);
    const [images, setImages] = useState<ImageMetadata[]>([]);
    const [error, setError] = useState<string>('');
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        const initializePage = async () => {
            const id = getUserId();

            if (!id) {
                router.push('/');
                return;
            }

            setUserId(id);
            await loadImages(id);
            setLoading(false);
        };

        initializePage();
    }, [router]);

    const loadImages = async (id: string) => {
        const userImages = await getUserImages(id);
        setImages(userImages);
    };

    const handleUploadComplete = async () => {
        if (userId) {
            await loadImages(userId);
        }
    };

    const handleError = (errorMessage: string) => {
        setError(errorMessage);
        setTimeout(() => setError(''), 5000);
    };

    const handleDeleteImage = async (imageId: string, blobUrl: string) => {
        if (!confirm('Are you sure you want to delete this image?')) return;

        setDeletingId(imageId);
        const success = await deleteImage(imageId, blobUrl);

        if (success) {
            setImages(images.filter(img => img.id !== imageId));
        } else {
            setError('Failed to delete image');
        }

        setDeletingId(null);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <motion.div
                    className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
            </div>
        );
    }

    if (!userId) return null;

    return (
        <div className="min-h-screen p-4 sm:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent mb-2">
                                Custom Images
                            </h1>
                            <p className="text-white/60">
                                Upload square images to use in your memory game
                            </p>
                        </div>
                        <button
                            onClick={() => router.push('/game')}
                            className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-glow hover:scale-105"
                        >
                            ← Back to Game
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
                        <div className="flex items-center gap-4">
                            <div>
                                <div className="text-sm text-white/60">Total Images</div>
                                <div className="text-2xl font-bold text-white">{images.length}</div>
                            </div>
                            <div className="text-white/20">|</div>
                            <div>
                                <div className="text-sm text-white/60">Recommended</div>
                                <div className="text-sm text-white">8+ for 4×4, 18+ for 6×6</div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Error Message */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Upload Section */}
                <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <ImageUploader
                        userId={userId}
                        onUploadComplete={handleUploadComplete}
                        onError={handleError}
                    />
                </motion.div>

                {/* Images Grid */}
                {images.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h2 className="text-2xl font-bold text-white mb-4">Your Images</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {images.map((image, index) => (
                                <motion.div
                                    key={image.id}
                                    className="relative group aspect-square"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <div className="relative w-full h-full rounded-xl overflow-hidden border-2 border-white/10 hover:border-primary-500 transition-all">
                                        <img
                                            src={image.blob_url}
                                            alt={`Uploaded image ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />

                                        {/* Delete Button */}
                                        <motion.button
                                            onClick={() => handleDeleteImage(image.id, image.blob_url)}
                                            disabled={deletingId === image.id}
                                            className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            {deletingId === image.id ? (
                                                <motion.div
                                                    className="w-8 h-8 border-2 border-white border-t-transparent rounded-full"
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                                />
                                            ) : (
                                                <svg
                                                    className="w-12 h-12 text-red-400"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                    />
                                                </svg>
                                            )}
                                        </motion.button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Empty State */}
                {images.length === 0 && (
                    <motion.div
                        className="text-center py-12 bg-white/5 backdrop-blur-md rounded-xl border border-white/10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="text-6xl mb-4">📷</div>
                        <h3 className="text-xl font-semibold text-white mb-2">No images yet</h3>
                        <p className="text-white/60">Upload your first square image to get started</p>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
