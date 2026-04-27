/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary:      "#2ecc71",
        primaryHover: "#27ae60",
        secondary:    "#e05fa0",
        dark:         "#1a2e1a",
      },
    },
  },
  plugins: [],
};
