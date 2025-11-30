/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
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
        gold: {
          50: '#fffaf0',
          100: '#fff3d1',
          200: '#ffeaa3',
          300: '#ffd66b',
          400: '#ffc43a',
          500: '#ffb020',
          600: '#eaa213',
          700: '#b6760e',
          800: '#8d5a0b',
          900: '#5f3b07',
        },
        burgundy: {
          50: '#fff5f6',
          100: '#feecec',
          200: '#fcd6db',
          300: '#f7a9b3',
          400: '#f07d8e',
          500: '#e14a65',
          600: '#c12746',
          700: '#9a1634',
          800: '#74102a',
          900: '#4a0918',
        },
        brand: {
          DEFAULT: '#ffb020',
          50: '#fffaf0',
          100: '#fff3d1',
          200: '#ffeaa3',
          300: '#ffd66b',
          400: '#ffc43a',
          500: '#ffb020',
          600: '#eaa213',
          700: '#b6760e',
          800: '#8d5a0b',
          900: '#5f3b07',
        },
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.6s ease-in',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100px)', opacity: '0' },
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
