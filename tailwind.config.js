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
        primary: "#135bec", // Orijinal Mavi
        secondary: "#111827", // Koyu Gri/Siyah (Yazılar ve Başlıklar için)
        background: {
          light: "#f3f4f6", // Açık Gri Arka Plan
          dark: "#111827", // Koyu Mod Arka Plan
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}