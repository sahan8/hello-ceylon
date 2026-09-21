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
          DEFAULT: '#102A43',
          950: '#081C2E',
          900: '#102A43',
          800: '#163F5C',
          700: '#1F5A78',
          600: '#2A7892',
          100: '#DCEAF0',
          50: '#EEF6F8',
        },
        gold: {
          DEFAULT: '#A66A12',
          deep: '#7C4A08',
          bright: '#F2B84B',
          soft: '#F8E5B8',
        },
        cinnamon: {
          DEFAULT: '#D46A5A',
          deep: '#A84A40',
        },
        shell: '#FBF8F1',
        parchment: '#F1E6D4',
        ink: '#17202A',
        moss: '#536273',
        line: '#D9DEE4',
        lagoon: '#2A8C9F',
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        sans: ['var(--font-sans)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
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
