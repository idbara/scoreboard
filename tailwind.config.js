/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        dark: {
          bg: '#0a1628',
          card: '#111d33',
          surface1: '#162240',
          surface2: '#1c2d50',
        },
        court: {
          green: '#1a6b3c',
          'green-light': '#228b4a',
          'green-dark': '#145530',
          line: 'rgba(255, 255, 255, 0.85)',
          net: '#e8d44d',
        },
        team: {
          a: '#3b82f6',
          'a-light': '#60a5fa',
          b: '#ef4444',
          'b-light': '#f87171',
        },
        accent: '#22d3ee',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'shuttle-bob': 'shuttle-bob 2s ease-in-out infinite',
        'pulse-warn': 'pulse-warn 1s ease-in-out infinite',
        'score-pop': 'score-pop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'swap-right': 'swapRight 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'swap-left': 'swapLeft 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'swap-up': 'swapUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'swap-down': 'swapDown 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'overlay-in': 'overlay-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'spin-slow': 'spin-slow 2s linear infinite',
        'trophy-bounce': 'trophy-bounce 1s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'confetti-fall': 'confetti-fall 3s linear forwards',
        'court-flip': 'court-flip 0.8s ease-in-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'shuttle-bob': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-3px)' },
        },
        'pulse-warn': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.15)' },
        },
        'score-pop': {
          '0%': { transform: 'scale(1)' },
          '40%': { transform: 'scale(1.3)' },
          '100%': { transform: 'scale(1)' },
        },
        swapRight: {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '30%': { transform: 'translateX(30%)', opacity: '0.5' },
          '50%': { transform: 'translateX(0)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        swapLeft: {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '30%': { transform: 'translateX(-30%)', opacity: '0.5' },
          '50%': { transform: 'translateX(0)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        swapUp: {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '30%': { transform: 'translateY(-30%)', opacity: '0.5' },
          '50%': { transform: 'translateY(0)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        swapDown: {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '30%': { transform: 'translateY(30%)', opacity: '0.5' },
          '50%': { transform: 'translateY(0)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'overlay-in': {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        'trophy-bounce': {
          '0%': { transform: 'scale(0) rotate(-15deg)' },
          '60%': { transform: 'scale(1.2) rotate(5deg)' },
          '100%': { transform: 'scale(1) rotate(0deg)' },
        },
        'confetti-fall': {
          '0%': { transform: 'translateY(-100%)', opacity: '1', rotate: '0deg' },
          '100%': { transform: 'translateY(400%)', opacity: '0', rotate: '720deg' },
        },
        'court-flip': {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '40%': { transform: 'scale(0.95)', opacity: '0.5' },
          '60%': { transform: 'scale(0.95)', opacity: '0.5' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
