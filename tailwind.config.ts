import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                background: '#0a0a0f',
                foreground: '#ffffff',
                primary: {
                    50: '#f0f9ff',
                    100: '#e0f2fe',
                    200: '#bae6fd',
                    300: '#7dd3fc',
                    400: '#38bdf8',
                    500: '#0ea5e9',
                    600: '#0284c7',
                    700: '#0369a1',
                    800: '#075985',
                    900: '#0c4a6e',
                },
                accent: {
                    50: '#fdf4ff',
                    100: '#fae8ff',
                    200: '#f5d0fe',
                    300: '#f0abfc',
                    400: '#e879f9',
                    500: '#d946ef',
                    600: '#c026d3',
                    700: '#a21caf',
                    800: '#86198f',
                    900: '#701a75',
                },
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
                'glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
            },
            backdropBlur: {
                xs: '2px',
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'spin-slow': 'spin 8s linear infinite',
                'flip': 'flip 0.6s ease-in-out',
                'bounce-in': 'bounceIn 0.5s ease-out',
                'confetti': 'confetti 3s ease-out forwards',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                flip: {
                    '0%': { transform: 'rotateY(0deg)' },
                    '100%': { transform: 'rotateY(180deg)' },
                },
                bounceIn: {
                    '0%': { opacity: '0', transform: 'scale(0.3)' },
                    '50%': { opacity: '1', transform: 'scale(1.05)' },
                    '70%': { transform: 'scale(0.9)' },
                    '100%': { transform: 'scale(1)' },
                },
                confetti: {
                    '0%': { transform: 'translateY(0) rotate(0deg)', opacity: '1' },
                    '100%': { transform: 'translateY(100vh) rotate(720deg)', opacity: '0' },
                },
            },
            boxShadow: {
                'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                'glow': '0 0 20px rgba(14, 165, 233, 0.5)',
                'glow-accent': '0 0 20px rgba(217, 70, 239, 0.5)',
            },
        },
    },
    plugins: [],
}

export default config
