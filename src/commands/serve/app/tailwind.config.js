/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Roboto Slab", "sans-serif"],
        mono: ["Roboto Mono", "monospace"],
      },
      colors: {
        sky: {
          900: "#0c4a6e",
        },
        amber: {
          300: "#FBD85E",
        },
      },
    },
  },
  plugins: [],
};
