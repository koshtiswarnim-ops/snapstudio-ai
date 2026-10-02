/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ground: {
          DEFAULT: '#06070A',
          secondary: '#0B0D12',
          tertiary: '#12151E',
          card: '#0F121B',
        },
        ink: {
          DEFAULT: '#E6EAF0',
          secondary: '#98A0AE',
          muted: '#666E7C',
        },
        accent: {
          cyan: '#4FD8E8',
          violet: '#8B6FE8',
        },
        hairline: 'rgba(230, 234, 240, 0.11)',
      },
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
        mono: ['"Chivo Mono"', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.04em',
        tightHeading: '-0.035em',
        monoLabel: '0.08em',
        monoWide: '0.12em',
      },
      borderRadius: {
        'scientific': '8px',
        'scientific-lg': '16px',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-pulse': 'glow 2.5s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { opacity: '0.4', filter: 'blur(20px)' },
          '100%': { opacity: '0.8', filter: 'blur(35px)' },
        },
      },
    },
  },
  plugins: [],
}
