/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'twitter-blue': '#1d9bf0',
        'twitter-hover': '#1a8cd8',
      }
    },
  },
  plugins: [],
}

