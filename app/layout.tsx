import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Memory Puzzle Game',
    description: 'A beautiful, modern memory puzzle game with custom image support',
    keywords: ['memory game', 'puzzle', 'brain training', 'card matching'],
    authors: [{ name: 'Memory Puzzle Team' }],
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <div className="min-h-screen">
                    {children}
                </div>
            </body>
        </html>
    );
}
