/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      boxShadow:{
        cornerStampLight:'5px 5px 0px 0px rgba(109,40,217)',
        cornerStampDark:'5px 5px 0px 0px #5BC0BE',
      },
      colors:{
        darkTheme:'#0B132B',
        dark300:'#1C2541',
        dark400:'#3A506B',
        pastelTosca:'#5BC0BE',
        darkIndigo:'#4F517D',
        lightIndigo:'#A997DF',
        hotOrange:'#F95738',
        mediumOrange:'#EE964B',
        lightOrange:'#F4D35E',
        oceanBlue:'#0D3B66'
      },
      screens:{
        phone:'320px',
        tablet:'640px',
        laptop:'1024px',
      },
      fontFamily:{
        'testTitle':["Playfair Display, serif"],
        'roboto':['Roboto, serif'],
        'testLogo':['Rowdies, serif']
      }
    },
  },
  plugins: [require('tailwind-scrollbar')],
}

