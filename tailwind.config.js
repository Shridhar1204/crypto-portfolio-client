/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{html,js,jsx,ts,tsx}',   // Ensure all your React files are included
    './src/pages/**/*.{js,jsx,ts,tsx}',  // Ensure this path is correct for your pages
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

