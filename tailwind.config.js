/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 麻將主題色彩
        'mahjong-green': '#1a5f3f',
        'mahjong-red': '#dc2626',
        'mahjong-gold': '#fbbf24',
      }
    },
  },
  plugins: [],
}

