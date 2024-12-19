/** @type {import('tailwindcss').Config} */
export default {
  content: [ './src/*.{js,ts,jsx,tsx}','./src/components/*.{js,ts,jsx,tsx}','./src/pages/*.{js,ts,jsx,tsx}'],
  darkMode: 'class', // Enables dark mode via class strategy
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
      },
    },
  },
  plugins: [],
};
