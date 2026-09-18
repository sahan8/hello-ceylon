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
            DEFAULT: '#0E4638',
            950: '#082B23',
            900: '#0E4638',
            800: '#155A49',
            700: '#1A705A',
            600: '#21856A',
            100: '#DCEBE4',
            50: '#EFF7F2',
        },
        gold: {
          DEFAULT: '#966100',
          deep: '#704700',
          bright: '#D9AA3C',
          soft: '#F5E8C5',
        },
        cinnamon: {
          DEFAULT: '#A9462F',
          deep: '#843522',
        },
        shell: '#FCFAF5',
        parchment: '#F1EBDD',
        ink: '#193027',
        moss: '#4F6258',
        line: '#DED8CA',
        lagoon: '#286B78',
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
