/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "src/**/*.{liquid,html,slim}",
    "src/_components/**/*.{liquid,html,slim}",
    "src/_layouts/**/*.{liquid,html,slim}"
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/typography"),
  ],
}

