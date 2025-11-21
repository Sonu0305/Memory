'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { validateImage } from '@/utils/imageValidation';
import { saveImageMetadata } from '@/actions/images';

interface ImageUploaderProps {
    userId: string;
    onUploadComplete?: (imageUrl: string) => void;
    onError?: (error: string) => void;
}

export default function ImageUploader({ userId, onUploadComplete, onError }: ImageUploaderProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (files: FileList | null) => {
        if (!files || files.length === 0) return;

        const file = files[0];
        setIsUploading(true);
        setUploadProgress('Validating image...');

        try {
            // Validate image
            const validation = await validateImage(file);
            if (!validation.valid) {
                onError?.(validation.error || 'Invalid image');
                setIsUploading(false);
                return;
            }

            // Upload to blob storage
            setUploadProgress('Uploading to storage...');
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const result = await response.json();

            // Save metadata to database
            setUploadProgress('Saving metadata...');
            const metadata = await saveImageMetadata(userId, result.url, result.pathname);

            if (!metadata) {
                throw new Error('Failed to save image metadata');
            }

            setUploadProgress('Upload complete!');
            onUploadComplete?.(result.url);

            // Reset after success
            setTimeout(() => {
                setIsUploading(false);
                setUploadProgress('');
            }, 1000);
        } catch (error) {
            console.error('Upload error:', error);
            onError?.(error instanceof Error ? error.message : 'Upload failed');
            setIsUploading(false);
            setUploadProgress('');
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        handleFileSelect(e.dataTransfer.files);
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="relative">
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileSelect(e.target.files)}
                className="hidden"
            />

            <motion.div
                className={`relative border-2 border-dashed rounded-xl p-8 transition-all cursor-pointer ${isDragging
                        ? 'border-primary-400 bg-primary-500/10'
                        : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10'
                    }`}
                onClick={handleClick}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <AnimatePresence mode="wait">
                    {isUploading ? (
                        <motion.div
                            key="uploading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center"
                        >
                            <motion.div
                                className="w-16 h-16 mx-auto mb-4 border-4 border-primary-500 border-t-transparent rounded-full"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            />
                            <p className="text-white font-medium">{uploadProgress}</p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="idle"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center"
                        >
                            <motion.div
                                className="mx-auto mb-4 w-16 h-16 text-white/40"
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                    />
                                </svg>
                            </motion.div>
                            <p className="text-white font-medium mb-2">
                                Drop your image here or click to browse
                            </p>
                            <p className="text-white/60 text-sm">
                                Image must be square (1:1 ratio) • Max 5MB
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
