import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Memory Puzzle Game',
    description: 'A beautiful, modern memory puzzle game with custom image support',
    keywords: ['memory game', 'puzzle', 'brain training', 'card matching'],
    authors: [{ name: 'Memory Puzzle Team' }],
    viewport: 'width=device-width, initial-scale=1',
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
