/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#b7102a",
        secondary: "#9b4500",
        tertiary: "#006a35",
        "success-green": "#2ECC71",
        "warning-gold": "#F49D00",
        "vibrant-lime": "#CAFB0B",
        "background-base": "#F8F9FA",
        surface: "#f7f9ff",
        "surface-white": "#FFFFFF",
        "on-surface": "#181c20",
        "on-surface-variant": "#5b403f",
        outline: "#8f6f6e",
        "outline-variant": "#e4bebc",
        // Extended container/surface colors from specs
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f1f4f9",
        "surface-container": "#ebeef3",
        "surface-container-high": "#e5e8ee",
        "surface-container-highest": "#e0e3e8",
        "secondary-container": "#fc8a40",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      borderRadius: {
        xl: "16px",
      },
      spacing: {
        gutter: "24px",
        "margin-desktop": "40px",
        "margin-mobile": "16px",
      },
      maxWidth: {
        "container-max-width": "1280px",
      },
    },
  },
  plugins: [],
}
