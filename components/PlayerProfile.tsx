'use client';

import { motion } from 'framer-motion';
import type { Profile } from '@/lib/types';

interface PlayerProfileProps {
    profile: Profile;
}

export default function PlayerProfile({ profile }: PlayerProfileProps) {
    return (
        <motion.div
            className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 inline-block"
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
            </div>
        </motion.div>
    );
}
