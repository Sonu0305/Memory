'use client';

import { motion } from 'framer-motion';
import type { Profile } from '@/lib/types';

interface PlayerProfileProps {
    profile: Profile;
    onLogout?: () => void;
}

export default function PlayerProfile({ profile, onLogout }: PlayerProfileProps) {
    return (
        <motion.div
            className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 inline-block relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
        >
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-2xl shadow-glow">
                    {profile.name.charAt(0).toUpperCase()}
                </div>
                <div>
                    <div className="text-sm text-white/60">Player</div>
                    <div className="text-lg font-semibold text-white">{profile.name}</div>
                </div>
                {onLogout && (
                    <button
                        onClick={onLogout}
                        className="ml-2 p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                        title="Logout"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                    </button>
                )}
            </div>
        </motion.div>
    );
}
