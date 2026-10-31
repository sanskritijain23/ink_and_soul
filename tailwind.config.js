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
          DEFAULT: '#DDE7D8',
          dark: "#A8B9A0",
          ink: "#405847",
        },
        paper: {
          DEFAULT: "#F5F1E7",
          card: "#FFFCF6",
          border: "#E4DCCB",
        },
        forest: {
          DEFAULT: "#293D32",
          light: "#405D49",
          dark: "#1D2C24",
        },
        clay: {
          DEFAULT: "#D4A18A",
          light: "#E5C0AD",
          dark: "#B87968",
        },
        burgundy: {
          DEFAULT: "#702D3B",
          light: "#8D4B58",
          dark: "#55212D",
        },
        ink: {
          DEFAULT: "#302F28",
          muted: "#77776A",
          brown: "#665C4F",
        },
        accent: {
          DEFAULT: "#B87968",
        },
        rose: {
          DEFAULT: "#E8D4CB",
          dark: "#C99F91",
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