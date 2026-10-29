/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        midnight: {
          DEFAULT: '#0B1020',
          50: '#F3F5FA',
          100: '#E1E5F2',
          800: '#11172D',
          900: '#0B1020',
          950: '#060913',
        },
        slateCustom: {
          DEFAULT: '#171F35',
          card: '#131B30',
          border: '#232D4B',
          muted: '#8E9BB5',
        },
        violetAccent: {
          DEFAULT: '#7C5CFC',
          hover: '#6845F5',
          light: '#EBE7FE',
          glow: 'rgba(124, 92, 252, 0.25)',
        },
        tealAccent: {
          DEFAULT: '#22C7A9',
          hover: '#1BB296',
          light: '#E2F9F4',
          glow: 'rgba(34, 199, 169, 0.25)',
        },
        coralWarning: {
          DEFAULT: '#F87171',
          hover: '#EF4444',
          light: '#FEE2E2',
          glow: 'rgba(248, 113, 113, 0.25)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

