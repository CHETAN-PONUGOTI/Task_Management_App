/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    // Scans all files in the src folder that are .js, .jsx, .ts, or .tsx
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

