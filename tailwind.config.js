/** @type {import('tailwindcss').Config} */
export default {
    content: [
      './app/**/*.{js,ts,jsx,tsx,mdx}', // Dành cho App Router (Next.js 13+)
      './shared/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  };