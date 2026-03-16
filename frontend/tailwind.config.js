/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0f0a00',
        'bg-card': '#1a1200',
        'bg-elevated': '#251a00',
        'accent-saffron': '#FF9933',
        'accent-gold': '#FFD700',
        'accent-green': '#138808',
        'accent-red': '#dc2626',
        'accent-white': '#f8f4ee',
        'text-primary': '#f8f4ee',
        'text-secondary': '#c9a96e',
        'text-tertiary': '#7a6040',
        'border-default': 'rgba(255,153,51,0.15)',
        'border-hover': 'rgba(255,153,51,0.4)',
        'border-active': 'rgba(255,153,51,0.8)',
      },
      fontFamily: {
        'devanagari': ['"Noto Serif Devanagari"', 'serif'],
        'sans': ['"DM Sans"', 'sans-serif'],
        'mono': ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'pulse-saffron': 'pulseSaffron 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.3s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
      },
      keyframes: {
        pulseSaffron: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(255,153,51,0.4)' },
          '50%': { boxShadow: '0 0 0 12px rgba(255,153,51,0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
