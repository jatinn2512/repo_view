/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1a1a2e",
        mist: "#f3f6fb",
        panel: "#f8fbff",
        line: "#dbe3f0",
        success: {
          50: "#edfdf3",
          100: "#d6f8e3",
          500: "#22c55e",
          700: "#15803d"
        },
        accent: {
          50: "#eef4ff",
          100: "#dfeaff",
          200: "#bfd6ff",
          300: "#93bbff",
          400: "#5a94ff",
          500: "#2563eb",
          600: "#1f51cb",
          700: "#1d43a3",
          800: "#1d3c84",
          900: "#1d356d"
        }
      },
      boxShadow: {
        shell: "0 26px 70px rgba(20, 32, 61, 0.10)",
        soft: "0 18px 40px rgba(20, 32, 61, 0.07)",
        glow: "0 18px 48px rgba(37, 99, 235, 0.18)"
      },
      fontFamily: {
        sans: ["DM Sans", "Segoe UI", "sans-serif"],
        display: ["Space Grotesk", "DM Sans", "Segoe UI", "sans-serif"]
      },
      backgroundImage: {
        "page-glow":
          "radial-gradient(circle at top left, rgba(37, 99, 235, 0.12), transparent 24%), radial-gradient(circle at top right, rgba(59, 130, 246, 0.08), transparent 18%), linear-gradient(180deg, #f8fbff 0%, #f1f5fb 100%)"
      }
    }
  },
  plugins: []
};
