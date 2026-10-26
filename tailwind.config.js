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
          dark: "C99F91",
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