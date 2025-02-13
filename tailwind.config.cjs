/** @type {import('tailwindcss').Config} */
const { nextui } = require("@nextui-org/react");
const colors = require("tailwindcss/colors");

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
    screens: {
      sm: { min: "0px", max: "675px" },
      // => @media (min-width: 500px) { ... }

      md: { min: "676px", max: "1000px" },
      // => @media (min-width: 1000px) { ... }

      lg: { min: "1001px", max: "1500px" },
      // => @media (min-width: 1500px) { ... }

      xl: { min: "1501px", max: "2000px" },
      // => @media (min-width: 2000px) { ... }

      "2xl": { min: "2001px" },
      // => @media (min-width: 2500px) { ... }
    },
    colors: {
      ...colors,
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};
