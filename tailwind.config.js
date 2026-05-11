/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Inter",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif"
        ]
      },
      colors: {
        ink: {
          900: "#0a0a0a",
          700: "#1f1f1f",
          500: "#6b6b6b",
          300: "#cfcfcf",
          100: "#f4f4f4"
        }
      },
      transitionTimingFunction: {
        "out-soft": "cubic-bezier(0.22, 1, 0.36, 1)"
      }
    }
  },
  plugins: []
};
