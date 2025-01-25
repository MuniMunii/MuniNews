/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors:{
        darkTheme:'#0B132B',
        dark300:'#1C2541',
        dark400:'#3A506B',
        pastelTosca:'#5BC0BE',
        hotOrange:'#F95738',
        mediumOrange:'#EE964B',
        lightOrange:'#F4D35E',
      },
      screens:{
        phone:'320px',
        tablet:'640px',
        laptop:'1024px',
      },
      fontFamily:{
        'testTitle':["Playfair Display, serif"],
        'roboto':['Roboto, serif']
      }
    },
  },
  plugins: [require('tailwind-scrollbar')],
}

