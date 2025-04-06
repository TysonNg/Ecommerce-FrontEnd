/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./src/**/*.{js,ts,jsx,tsx}",
      "./pages/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
      "./test.jsx",
    ],
    theme: {
      extend: {
        screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
      },
      fontSize: {
        
        'tiny': '0.625rem',  
        'xs': '0.75rem',     
        'sm': '0.875rem',   
        'base': '1rem',      
        'lg': '1.125rem',   
        'xl': '1.25rem',     
        '2xl': '1.5rem',    
        '3xl': '1.875rem',   
        '4xl': '2.25rem',    
      },
    },
    },
    plugins: [],
  };
  