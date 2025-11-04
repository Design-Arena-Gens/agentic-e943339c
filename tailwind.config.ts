import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./styles/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f1f5ff",
          100: "#dce8ff",
          200: "#b7cfff",
          300: "#8cb1ff",
          400: "#5a8bff",
          500: "#2b62f6",
          600: "#1a4ad3",
          700: "#1439a7",
          800: "#122f82",
          900: "#112a69"
        }
      }
    }
  },
  plugins: [],
};

export default config;
