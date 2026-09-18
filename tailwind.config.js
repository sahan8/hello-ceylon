/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        canopy: {
          DEFAULT: '#0C3B2E',
          950: '#06231B',
          900: '#0C3B2E',
          800: '#10503D',
          700: '#146149',
          600: '#1A7A5B',
          100: '#DCEAE2',
          50: '#EDF4EF',
        },
        gold: {
          DEFAULT: '#A16207',
          deep: '#7C4E05',
          bright: '#E3B23C',
          soft: '#F5E7C1',
        },
        cinnamon: {
          DEFAULT: '#B34A2B',
          deep: '#8C3620',
        },
        shell: '#FAF7F0',
        parchment: '#F3EEE1',
        ink: '#14211B',
        moss: '#55645B',
        line: '#E3DDCF',
        lagoon: '#2C6E7F',
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        sans: ['var(--font-sans)', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'float': 'float 7s ease-in-out infinite',
        'float-delayed': 'float 7s ease-in-out 3.5s infinite',
        'marquee': 'marquee 36s linear infinite',
        'spin-slow': 'spin 10s linear infinite',
        'spin-slower': 'spin 24s linear infinite',
        'pulse-soft': 'pulseSoft 3.5s ease-in-out infinite',
        'bounce-gentle': 'bounceGentle 2.2s ease-in-out infinite',
        'drift': 'drift 14s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-16px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.45' },
          '50%': { opacity: '0.9' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        drift: {
          '0%, 100%': { transform: 'translate3d(0,0,0)' },
          '33%': { transform: 'translate3d(12px,-10px,0)' },
          '66%': { transform: 'translate3d(-10px,8px,0)' },
        },
      },
    },
  },
  plugins: [],
}
