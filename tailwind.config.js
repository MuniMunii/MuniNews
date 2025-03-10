/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode:'class',
  theme: {
    extend: {
      backgroundImage:{
        'LightModeGradient':'linear-gradient(90deg,var(--lightOrange),var(--hotOrange));',
        'DarkModeGradient':'linear-gradient(90deg,var(--DarkBlue),var(--DarkMossGreen))',
      },
      boxShadow:{
        cornerStampLight:'5px 5px 0px 0px rgba(109,40,217)',
        cornerStampGreen:'5px 5px 0px 0px rgba(21,128,61)',
        cornerStampBlue:'5px 5px 0px 0px rgba(29,78,216)',
        cornerStampRed:'5px 5px 0px 0px rgba(185,28,28)',
        cornerStampDark:'5px 5px 0px 0px #5BC0BE',
        shadow_Dark:'4px 8px 8px rgba(0,0,0,0.38)',
        shadow_Light:'4px 5px 5px rgba(255,255,255,0.38)'
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
        'testLogo':['Rowdies, serif'],
        'Garramond':["EB Garamond, serif"],
        'Poppins':["Poppins, serif"]
      }
    },
  },
  plugins: [require('tailwind-scrollbar'),require("tailwind-gradient-mask-image")],
}


