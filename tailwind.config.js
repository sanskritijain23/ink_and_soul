/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          DEFAULT: '#E7EDE2',
          dark: "#A3B39A",
          ink: "#344638",
        },
        paper: {
          DEFAULT: "#F8F5EC",
          card: "#FFFDF7",
          border: "#E5E0D4",
        },
        ink: {
          DEFAULT: "#39382E",
          muted: "#777568",
          brown: "#665F50",
        },
        accent: {
          DEFAULT: "#B47A70",
        },
      },
      fontFamily: {
        display: ["Cormorant Garamond", "serif"],
        sans: ["DM Sans", "sans-serif"],
        reading: ["Lora", "serif"],
      },
    },
  },
  plugins: [],
}