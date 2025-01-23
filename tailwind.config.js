/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      screens:{
        phone:'320px',
        tablet:'640px',
        laptop:'1024px',
      },
      fontFamily:{
        'roboto':['Roboto, serif']
      }
    },
  },
  plugins: [],
}

